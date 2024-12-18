import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";

import { SecureTokenService } from "src/shared/security";
import { FirestoreService, MailService } from "src/shared/third-party";

import { UserStatus } from "domain-shared/user";
import { LoginDTO, RegisterDTO, VerifyOtpDTO } from "../dto";
import { AuthResultDTO } from "../dto/res/auth-result.dto";
import { UserRepository } from "../infra/repositories";
import { UserModel, UserTokenModel } from "../models";
import { generateOTP, generateRandomNickname } from "../utils";
import { UserTokenService } from "./user-token.service";

/**
 * @description
 * 일반 인증을 관리하는 서비스
 */
@Injectable()
export class AuthService {

    constructor(
        private readonly firestore: FirestoreService,
        private readonly secureTokenService: SecureTokenService,
        private readonly mailService: MailService,
        private readonly userTokenService: UserTokenService,
        private readonly userRepository: UserRepository,
    ) { }

    async checkEmailDuplicate(email: string): Promise<boolean> {
        const user = await this.userRepository.findUserByEmail(email);
        return user ? true : false;
    }

    async getCredentialOrThrow(accessToken: string): Promise<UserModel> {
        const errMsg: string = '사용자를 찾을 수 없습니다.';
        const payload: JwtPayload = this.secureTokenService.verifyJwtToken(accessToken);
        const user: UserModel = await this.userRepository.findUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException(errMsg);
        }
        return user;
    }

    /**
     * @external
     * 사용자가 이메일 인증 대기중이면 토큰을 발급하지 않습니다.
     * 이메일로 OTP 코드를 발송하여 `verifyOtp` 프로세스와 연계합니다.
     */
    async login(dto: LoginDTO): Promise<AuthResultDTO> {
        const errMsg = '아이디 또는 비밀번호가 일치하지 않습니다.';
        const user = await this.getUserByEmailOrThrow(dto.email, errMsg);

        if (!user.comparePassword(dto.password)) {
            throw new UnauthorizedException(errMsg);
        }

        if (user.isPending()) {
            await this.mailService.send(user.email, user.otp);
            return AuthResultDTO.fromNeedOtp();
        }

        const accessToken: string = this.secureTokenService.generateJwtToken(user.id);
        const refreshToken: string = this.secureTokenService.generateOpaqueToken();

        await this.userTokenService.createUserToken(user.id, refreshToken);

        return AuthResultDTO.fromSuccess(accessToken, refreshToken);
    }

    /**
     * @external
     * 메서드의 프로세스가 완료되면 등록된 이메일로 OTP 코드를 발송합니다.
     * `verifyOtp` 프로세스와 연계합니다.
     */
    async register(dto: RegisterDTO): Promise<void> {
        const duplicatedErrMsg = '이미 존재하는 아이디입니다.';
        const hasEmail: boolean = await this.checkEmailDuplicate(dto.email);
        console.log(hasEmail);
        if (hasEmail) {
            throw new BadRequestException(duplicatedErrMsg);
        }

        let randomNickname = generateRandomNickname();
        let otp = generateOTP();

        const user = UserModel.create({
            email: dto.email,
            nickname: randomNickname,
            password: dto.password,
            otp,
        });

        await this.userRepository.save(user);

        await this.mailService.send(dto.email, otp);
    }

    async verifyOtp(dto: VerifyOtpDTO): Promise<AuthResultDTO> {
        console.log('실행');
        return await this.firestore.runInTransaction(async () => {
            const notFoundErrMsg = '이메일을 찾을 수 없습니다.';
            const notMatchedErrMsg = 'OTP 코드가 일치하지 않습니다.';
            let user = await this.getUserByEmailOrThrow(dto.email, notFoundErrMsg);

            if (!user.compareOtp(dto.otp)) {
                throw new UnauthorizedException(notMatchedErrMsg);
            }

            user = user.withUpdateStatus(UserStatus.ACTIVE);
            await this.userRepository.save(user);

            const accessToken: string = this.secureTokenService.generateJwtToken(user.id);
            const refreshToken: string = this.secureTokenService.generateOpaqueToken();

            await this.userTokenService.createUserToken(user.id, refreshToken);

            throw new BadRequestException('에러 발생');

            return AuthResultDTO.fromSuccess(accessToken, refreshToken);
        });
    }

    async refreshTokens(_refreshToken: string): Promise<AuthResultDTO> {
        const userToken: UserTokenModel = await this.userTokenService.getUserTokenOrThrow(_refreshToken);
        const accessToken: string = this.secureTokenService.generateJwtToken(userToken.userId);
        const refreshToken: string = this.secureTokenService.generateOpaqueToken();

        await this.userTokenService.createUserToken(userToken.userId, refreshToken);

        return AuthResultDTO.fromSuccess(accessToken, refreshToken);
    }

    private async getUserByEmailOrThrow(email: string, errMsg: string): Promise<UserModel> {
        const user: UserModel = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException(errMsg);
        }
        return user;
    }
}