import { BadRequestException, Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";

import { OtpService } from "src/shared/third-party";
import { RegisterDTO } from "../dto";
import { UserEntity } from "../infra/entities";
import { UserRepository } from "../infra/repositories";

/**
 * @description
 * 일반 인증을 관리하는 서비스
 */
@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpService: OtpService
    ) { }

    async register(dto: RegisterDTO): Promise<void> {
        // STEP: 중복 검사
        const hasUser = await this.userRepository.findUserByEmail(dto.email);
        if (hasUser) {
            throw new BadRequestException('이미 존재하는 아이디입니다.');
        }

        // Given: 회원 엔티티 생성 필요 데이터 초기화 
        let randomNickname = '랜덤닉네임';
        let userId = nanoid(30);
        let otpCode = nanoid(6);

        // STEP: 회원 엔티티 생성
        const user = UserEntity.create({
            id: userId,
            email: dto.email,
            nickname: randomNickname,
            password: dto.password,
            otpCode,
        });

        // STEP: DB에 회원 데이터 저장
        await this.userRepository.save(user);

        // STEP: OTP 발송
        await this.otpService.sendToEmail(dto.email, otpCode);
    }
}