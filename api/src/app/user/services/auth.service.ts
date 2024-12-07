import { BadRequestException, Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";

import { UsernameTypes } from "domain-shared/user";
import { SecureTokenService } from "src/shared/security";
import { MailService } from "src/shared/third-party";

import { RegisterDTO, VerifyOtpDTO } from "../dto";
import { TokenResultDTO } from "../dto/res/token-result.dto";
import { UserEntity } from "../infra/entities";
import { UserRepository } from "../infra/repositories";
import { generateOTP, generateRandomNickname } from "../utils";

/**
 * @description
 * 일반 인증을 관리하는 서비스
 */
@Injectable()
export class AuthService {

    constructor(
        private readonly secureTokenService: SecureTokenService,
        private readonly mailService: MailService,
        private readonly userRepository: UserRepository,
    ) { }

    async register(dto: RegisterDTO): Promise<void> {
        // STEP: 중복 검사
        const hasUser = await this.userRepository.findUserByEmail(dto.email);
        if (hasUser) {
            throw new BadRequestException('이미 존재하는 아이디입니다.');
        }

        // Given: 회원 엔티티 생성 필요 데이터 초기화 
        let userId = nanoid(30);
        let randomNickname = generateRandomNickname();
        let otp = generateOTP();

        // STEP: 회원 엔티티 생성
        const user = UserEntity.create({
            id: userId,
            email: dto.email,
            nickname: randomNickname,
            password: dto.password,
            otp,
        });

        // STEP: DB에 회원 데이터 저장
        await this.userRepository.save(user);

        // STEP: OTP 발송
        this.mailService.send(dto.email, otp);
    }

    async verifyOtp(dto: VerifyOtpDTO): Promise<TokenResultDTO> {
        let user: UserEntity = null;

        // STEP: otp + username 조합으로 회원 조회
        if (dto.type === UsernameTypes.EMAIL) {
            user = await this.userRepository.findUserByOtpWithEmail(dto.otp, dto.username);
        } else {
            user = await this.userRepository.findUserByOtpWithPhoneNumber(dto.otp, dto.username);
        }

        // STEP: 회원이 존재하지 않는 경우 에러 피드백
        if (!user) {
            throw new BadRequestException('인증 코드가 올바르지 않습니다.');
        }

        const accessTokenResult = this.secureTokenService.generateJwtToken(user.id);
        const refreshToken = this.secureTokenService.generateOpaqueToken();

        return TokenResultDTO.from({
            accessToken: accessTokenResult.token,
            refreshToken,
            expiresIn: accessTokenResult.expiresIn,
        });
    }
}