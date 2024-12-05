import { BadRequestException } from "@nestjs/common";
import { nanoid } from "nanoid";
import { RegisterWithPhoneDTO } from "../dto";

export class AuthService {

    constructor(
        private readonly userRepository: any
    ) { }

    async register(dto: RegisterWithPhoneDTO) {
        // STEP: 중복 검사
        const hasUser = await this.userRepository.findByUsername(dto.username);
        if (hasUser) {
            throw new BadRequestException('이미 존재하는 아이디입니다.');
        }

        // STEP: 회원가입
        let randomNickname = '랜덤닉네임';
        let userId = nanoid(30);

    }
}