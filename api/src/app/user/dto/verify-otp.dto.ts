import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, Length, Matches } from 'class-validator';

import { VerifyOtpDTO as TVerifyOtpDTO, USER_RULES, UsernameTypes } from 'domain-shared/user';
import { CheckUsername } from '../decorators';

export class VerifyOtpDTO implements TVerifyOtpDTO {

    @IsNotEmpty({ message: '아이디가 비어있습니다.' })
    @CheckUsername()
    @ApiProperty({ description: '로그인 아이디' })
    readonly username: string;

    @IsNotEmpty({ message: 'OTP 코드가 비어있습니다.' })
    @Length(USER_RULES.otp.min, USER_RULES.otp.max, { message: USER_RULES.otp.lengthErrMsg })
    @Matches(USER_RULES.otp.regex, { message: USER_RULES.otp.regexErrMsg })
    @ApiProperty({ description: 'OTP 코드' })
    readonly otp: string;

    @IsNotEmpty({ message: '아이디 유형이 올바르지 않습니다.' })
    @IsIn(Object.values(UsernameTypes), { message: '아이디 유형이 올바르지 않습니다.' })
    @ApiProperty({ description: '로그인 아이디 유형', enum: UsernameTypes })
    readonly type: UsernameTypes;
}