import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import { USER_RULES } from "domain-shared/user";

export class UpdatePasswordDTO {
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
    readonly email: string;

    @IsNotEmpty({ message: 'OTP 코드가 비어있습니다.' })
    @Length(USER_RULES.otp.min, USER_RULES.otp.max, { message: USER_RULES.otp.lengthErrMsg })
    @Matches(USER_RULES.otp.regex, { message: USER_RULES.otp.regexErrMsg })
    @ApiProperty({ description: 'OTP 코드', example: '123456' })
    readonly otp: string;

    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Length(USER_RULES.password.min, USER_RULES.password.max, { message: USER_RULES.password.lengthErrMsg })
    @Matches(USER_RULES.password.regex, { message: USER_RULES.password.regexErrMsg })
    @ApiProperty({ description: '비밀번호', example: '1q2w3e1!@' })
    readonly password: string;
}