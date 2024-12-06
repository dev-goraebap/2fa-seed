import { BadRequestException, Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";

import { RegisterWithPhoneDTO } from "../dto";
import { UserEntity } from "../infra/entities";

/**
 * @description
 * 일반 인증을 관리하는 서비스
 */
@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: any,
        private readonly otpService: any
    ) { }

    async register(dto: RegisterWithPhoneDTO): Promise<void> {
        // STEP: 중복 검사
        const hasUser = await this.userRepository.findByUsername(dto.username);
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
            username: dto.username,
            nickname: randomNickname,
            password: dto.password,
            phoneNumber: dto.phoneNumber,
            otpCode,
        });

        // STEP: DB에 회원 데이터 저장
        await this.userRepository.save(user);

        // STEP: OTP 발송
        await this.otpService.send(dto.phoneNumber, otpCode);
    }
}