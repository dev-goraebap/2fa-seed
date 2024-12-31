import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

import { USER_RULES, LoginDTO as TLoginDTO } from 'domain-shared/user';

export class LoginDTO implements TLoginDTO {
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @Length(USER_RULES.email.min, USER_RULES.email.max, {
        message: `잘못된 형식입니다.`,
    })
    @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
    readonly email: string;

    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Length(USER_RULES.password.min, USER_RULES.password.max, {
        message: `잘못된 형식입니다.`,
    })
    @ApiProperty({ description: '비밀번호', example: '1q2w3e1!@' })
    readonly password: string;
}