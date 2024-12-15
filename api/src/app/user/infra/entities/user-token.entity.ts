import { plainToInstance } from "class-transformer";
import { Column, Entity, PrimaryColumn } from "typeorm";

import { BaseOrmEntity } from "src/shared/database";

@Entity({ comment: '사용자토큰정보', name: 'user_tokens' })
export class UserTokenEntity extends BaseOrmEntity {

    /**
     * @description 사용자 리프레시토큰 만료시간 (7일)
     */
    static readonly EXPIRES_TIME: number = 1000 * 60 * 24 * 7;

    @PrimaryColumn()
    readonly userId: string;

    @Column({ comment: '리프레시토큰', length: 200, unique: true })
    readonly refreshToken: string;

    @Column({ comment: '만료일자' })
    readonly expiresAt: Date;

    static create(param: Pick<UserTokenEntity, 'userId' | 'refreshToken'>): UserTokenEntity {
        return plainToInstance(UserTokenEntity, {
            userId: param.userId,
            refreshToken: param.refreshToken,
            expiresAt: new Date(Date.now() + UserTokenEntity.EXPIRES_TIME)
        });
    }
}