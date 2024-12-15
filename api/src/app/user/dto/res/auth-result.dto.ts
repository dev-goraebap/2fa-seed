import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthStatus, AuthResultDTO as TAuthResultDTO } from 'domain-shared/user';

export class AuthResultDTO implements TAuthResultDTO {

    @ApiProperty({ description: '인증 상태', enum: AuthStatus })
    readonly status: AuthStatus;

    @ApiProperty({ description: '액세스 토큰' })
    readonly accessToken: string | null;

    @ApiProperty({ description: '리프레시 토큰' })
    readonly refreshToken: string | null;

    static fromSuccess(accessToken: string, refreshToken: string) {
        return plainToInstance(AuthResultDTO, {
            status: AuthStatus.SUCCESS,
            accessToken,
            refreshToken
        } as AuthResultDTO);
    }

    static fromNeedOtp() {
        return plainToInstance(AuthResultDTO, {
            status: AuthStatus.NEED_OTP,
            accessToken: null,
            refreshToken: null
        } as AuthResultDTO);
    }
}