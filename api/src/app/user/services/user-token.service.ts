import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserTokenEntity } from "../infra/entities";
import { UserTokenRepository } from "../infra/repositories/user-token.repository";

/**
 * @description 사용자 토큰 관련 서비스
 * 
 * 인증 서비스, 소셜 서비스에서 리프레시토큰 관련 중복 로직을 처리하기 위한 공용 클래스 입니다.
 * 
 * 의존 방향성은 다음과 같습니다. 
 * 
 * - auth.service -> user-token.service
 * - social.service -> user-token.service
 */
@Injectable()
export class UserTokenService {

    constructor(
        private readonly userTokenRepository: UserTokenRepository
    ) { }

    async createUserToken(userId: string, refreshToken: string): Promise<void> {
        const userTokenEntity = UserTokenEntity.create({
            userId,
            refreshToken,
        });

        await this.userTokenRepository.save(userTokenEntity);
    }

    async getUserTokenOrThrow(refreshToken: string) {
        const errMsg: string = '리프레시 토큰이 유효하지 않습니다.';
        const userToken: UserTokenEntity = await this.userTokenRepository.findUserTokenByRefreshToken(refreshToken);
        if (!userToken) {
            throw new UnauthorizedException(errMsg);
        }
        return userToken;
    }
}
