import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, Matches } from "class-validator";

import { RegisterDTO as TRegisterDTO, RegisterWithEmailDTO as TRegisterWithEmailDTO, RegisterWithPhoneDTO as TRegisterWithPhoneDTO, USER_RULES } from 'domain-shared/user';

export class RegisterDTO implements TRegisterDTO {
    @IsNotEmpty({ message: '아이디는 필수 입력 항목입니다.' })
    @Length(USER_RULES.username.min, USER_RULES.username.max, { message: USER_RULES.username.lengthErrMsg })
    @Matches(USER_RULES.username.regex, { message: USER_RULES.username.regexErrMsg })
    @ApiProperty({ description: '아이디', example: 'user123' })
    readonly username: string;

    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Length(USER_RULES.password.min, USER_RULES.password.max, { message: USER_RULES.password.lengthErrMsg })
    @Matches(USER_RULES.password.regex, { message: USER_RULES.password.regexErrMsg })
    @ApiProperty({ description: '비밀번호', example: '1q2w3e1!@' })
    readonly password: string;

    @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
    @Length(USER_RULES.nickname.min, USER_RULES.nickname.max, { message: USER_RULES.nickname.lengthErrMsg })
    @Matches(USER_RULES.nickname.regex, { message: USER_RULES.nickname.regexErrMsg })
    @ApiProperty({ description: '닉네임', example: '사용자123' })
    readonly nickname: string;
}


export class RegisterWithEmailDTO extends RegisterDTO implements TRegisterWithEmailDTO {
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: '유효한 이메일 형식을 입력해주세요.',
    })
    @ApiProperty({ description: '이메일', example: 'test@example.com' })
    readonly email: string;
}

export class RegisterWithPhoneDTO extends RegisterDTO implements TRegisterWithPhoneDTO {
    @IsNotEmpty({ message: '휴대폰 번호는 필수 입력 항목입니다.' })
    @Length(USER_RULES.phone.min, USER_RULES.phone.max, {
        message: `휴대폰 번호는 ${USER_RULES.phone.min}자 이상 ${USER_RULES.phone.max}자 이하여야 합니다.`,
    })
    @Matches(USER_RULES.phone.regex, {
        message: '휴대폰 번호는 "01012345678" 또는 "010-1234-5678" 형식이어야 합니다.',
    })
    @ApiProperty({ description: '휴대폰 번호', example: '01012345678' })
    readonly phone: string;
}
