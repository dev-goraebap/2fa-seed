import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

import { USER_RULES } from 'domain-shared/user';

export class LoginDTO {
    @IsNotEmpty({ message: '아이디는 필수 입력 항목입니다.' })
    @Length(USER_RULES.username.min, USER_RULES.username.max, {
        message: `잘못된 형식입니다.`,
    })
    @ApiProperty({ description: '아이디', example: 'user123' })
    readonly username: string;

    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Length(USER_RULES.password.min, USER_RULES.password.max, {
        message: `잘못된 형식입니다.`,
    })
    @ApiProperty({ description: '비밀번호', example: '1q2w3e1!@' })
    readonly password: string;
}