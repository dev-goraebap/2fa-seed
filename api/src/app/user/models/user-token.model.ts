import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";
import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

import { FirebaseModel } from "src/shared/third-party";

export class UserTokenModel extends FirebaseModel {

    /**
     * @description 사용자 리프레시토큰 만료시간 (7일)
     */
    static readonly EXPIRES_TIME: number = 1000 * 60 * 24 * 7;

    readonly id: string;
    readonly userId: string;
    readonly refreshToken: string;
    readonly expiresAt: Date;

    static create(param: Pick<UserTokenModel, 'userId' | 'refreshToken'>): UserTokenModel {
        return plainToInstance(UserTokenModel, {
            id: nanoid(30),
            userId: param.userId,
            refreshToken: param.refreshToken,
            expiresAt: new Date(Date.now() + UserTokenModel.EXPIRES_TIME)
        });
    }

    static fromFirebase(param: OnlyProps<UserTokenModel>): UserTokenModel {
        return plainToInstance(UserTokenModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
        });
    }
}