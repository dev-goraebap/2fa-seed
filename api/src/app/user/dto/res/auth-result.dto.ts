import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthStatus, AuthResultDTO as TAuthResultDTO } from 'domain-shared/user';

export class AuthResultDTO implements TAuthResultDTO {

    @ApiProperty({ description: '인증 상태', enum: AuthStatus })
    readonly status: AuthStatus;

    @ApiProperty({ description: '액세스 토큰' })
    readonly accessToken: string | null;

    @ApiProperty({ description: '액세스 토큰 만료시간' })
    readonly expiresIn: number | null;

    /**
     * 서비스 -> 컨트롤러로 전달 될 때 만 사용되는 필드입니다.
     * 클라이언트로 전달 할 때 `toResponse` 메서드를 통해 변환하여 전달합니다.
     */
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

    toResponse(): TAuthResultDTO {
        return {
            status: this.status,
            accessToken: this.accessToken,
            expiresIn: this.expiresIn
        } as TAuthResultDTO;
    }
}