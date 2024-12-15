import { Injectable } from "@nestjs/common";
import { UserEntity, UserTokenEntity } from "../infra/entities";
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

    async createUserToken(user: UserEntity, refreshToken: string): Promise<void> {
        const userTokenEntity = UserTokenEntity.create({
            refreshToken,
            userId: user.id
        });

        await this.userTokenRepository.save(userTokenEntity);
    }
}
