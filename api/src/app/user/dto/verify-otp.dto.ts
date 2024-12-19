import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

import { VerifyOtpDTO as TVerifyOtpDTO, USER_RULES } from 'domain-shared/user';

export class VerifyOtpDTO implements TVerifyOtpDTO {

    @IsNotEmpty({ message: '이메일이 비어있습니다.' })
    @Length(USER_RULES.email.min, USER_RULES.email.max, { message: USER_RULES.email.lengthErrMsg })
    @Matches(USER_RULES.email.regex, { message: USER_RULES.email.regexErrMsg })
    @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
    readonly email: string;

    @IsNotEmpty({ message: 'OTP 코드가 비어있습니다.' })
    @Length(USER_RULES.otp.min, USER_RULES.otp.max, { message: USER_RULES.otp.lengthErrMsg })
    @Matches(USER_RULES.otp.regex, { message: USER_RULES.otp.regexErrMsg })
    @ApiProperty({ description: 'OTP 코드', example: '123456' })
    readonly otp: string;
}