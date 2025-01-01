import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

import { LoginDTO as TLoginDTO, RegisterDTO as TRegisterDTO, USER_RULES } from 'domain-shared/user';

export class RegisterDTO implements TRegisterDTO {
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
    readonly email: string;

    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Length(USER_RULES.password.min, USER_RULES.password.max, { message: USER_RULES.password.lengthErrMsg })
    @Matches(USER_RULES.password.regex, { message: USER_RULES.password.regexErrMsg })
    @ApiProperty({ description: '비밀번호', example: '1q2w3e1!@' })
    readonly password: string;
}

export class LoginDTO extends RegisterDTO implements TLoginDTO {
    @IsNotEmpty({ message: '디바이스ID가 필요합니다.' })
    @ApiProperty({ description: '디바이스ID' })
    readonly deviceId: string;
}