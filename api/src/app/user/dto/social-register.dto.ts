import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty } from "class-validator";
import { OAuthProviders } from "src/shared/third-party";

export class SocialRegisterDTO {

    @IsNotEmpty()
    @IsIn(Object.values(OAuthProviders))
    @ApiProperty({ description: '소셜프로바이더', enum: OAuthProviders })
    readonly provider: OAuthProviders;

    @IsNotEmpty()
    @ApiProperty()
    readonly accessTokenOrIdToken: string;

    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    @ApiProperty({ description: '이메일', example: 'test@gmail.com' })
    readonly email: string;
}

export class SocialLoginDTO {

    @IsNotEmpty()
    @IsIn(Object.values(OAuthProviders))
    @ApiProperty({ description: '소셜프로바이더', enum: OAuthProviders })
    readonly provider: OAuthProviders;

    @IsNotEmpty()
    @ApiProperty()
    readonly accessTokenOrIdToken: string;

    @IsNotEmpty({ message: '디바이스ID가 필요합니다.' })
    @ApiProperty({ description: '디바이스ID' })
    readonly deviceId: string;
}