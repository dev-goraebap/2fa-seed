import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiProperty } from "@nestjs/swagger";
import * as jwt from 'jsonwebtoken';
import { EnvConfig } from "src/shared/config";

export class AuthTokens {
    @ApiProperty()
    readonly accessToken: string;

    @ApiProperty()
    readonly expiresIn: number;

    @ApiProperty()
    readonly refreshToken: string;
}

/**
 * @description
 * 인증토큰 생성 클래스
 * 
 * - JWT 토큰 생성
 * - 불투명 토큰 생성
 */
@Injectable()
export class SecureTokenService {

    private readonly secretKey: string;
    private readonly expiresIn: number;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.secretKey = this.configService.get('ACCESS_TOKEN_SECRET');
        this.expiresIn = Number(this.configService.get('ACCESS_TOKEN_EXPIRES_IN'));
    }

    getAuthTokens(sub: string, payload?: Object): AuthTokens {
        const accessToken: string = this.generateJwtToken(sub, payload);
        const expiresIn: number = this.getJwtExpiresIn(accessToken);
        const refreshToken: string = this.generateOpaqueToken();
        return { accessToken, expiresIn, refreshToken };
    }

    generateOpaqueToken(): string {
        return crypto.randomUUID();
    }

    generateJwtToken(sub: string, payload?: Object): string {
        return jwt.sign(payload ?? {}, this.secretKey, {
            expiresIn: this.expiresIn,
            subject: sub,
        });
    }

    getJwtExpiresIn(token: string): number {
        const result = jwt.verify(token, this.secretKey) as jwt.JwtPayload;
        return result.exp;
    }

    verifyJwtToken(token: string): jwt.JwtPayload {
        try {
            return jwt.verify(token, this.secretKey) as jwt.JwtPayload;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException(err);
        }
    }
}