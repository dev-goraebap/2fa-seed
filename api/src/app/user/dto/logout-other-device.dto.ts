import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, Matches } from "class-validator";
import { USER_RULES } from "domain-shared/user";

export class LogoutOtherDeviceDTO {
        @IsNotEmpty({ message: 'OTP 코드가 비어있습니다.' })
        @Length(USER_RULES.otp.min, USER_RULES.otp.max, { message: USER_RULES.otp.lengthErrMsg })
        @Matches(USER_RULES.otp.regex, { message: USER_RULES.otp.regexErrMsg })
        @ApiProperty({ description: 'OTP 코드', example: '123456' })
        readonly otp: string;
    
        @IsNotEmpty()
        @ApiProperty({ description: '디바이스ID', example: 'xxxx-xxxx-xxxx' })
        readonly deviceId: string;
}