import { plainToInstance } from "class-transformer";

import { BaseFirebaseModel } from "src/shared/third-party";

export class UserTokenModel extends BaseFirebaseModel {

    /**
     * @description 사용자 리프레시토큰 만료시간 (7일)
     */
    static readonly EXPIRES_TIME: number = 1000 * 60 * 24 * 7;

    readonly userId: string;
    readonly refreshToken: string;
    readonly expiresAt: Date;

    static create(param: Pick<UserTokenModel, 'userId' | 'refreshToken'>): UserTokenModel {
        return plainToInstance(UserTokenModel, {
            userId: param.userId,
            refreshToken: param.refreshToken,
            expiresAt: new Date(Date.now() + UserTokenModel.EXPIRES_TIME)
        });
    }
}