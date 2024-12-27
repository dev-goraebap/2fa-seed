import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";
import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

import { FirebaseModel } from "src/shared/third-party";

export class UserSessionModel extends FirebaseModel {

    /**
     * @description 사용자 리프레시토큰 만료시간 (7일)
     */
    static readonly EXPIRES_TIME: number = 1000 * 60 * 24 * 7;

    readonly id: string;
    readonly userId: string;
    readonly refreshToken: string;
    readonly expiresAt: Date;

    static create(param: Pick<UserSessionModel, 'userId' | 'refreshToken'>): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            id: nanoid(30),
            userId: param.userId,
            refreshToken: param.refreshToken,
            expiresAt: new Date(Date.now() + UserSessionModel.EXPIRES_TIME)
        });
    }

    static fromFirebase(param: OnlyProps<UserSessionModel>): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
            expiresAt: (param.expiresAt as unknown as Timestamp).toDate(),
        });
    }
}