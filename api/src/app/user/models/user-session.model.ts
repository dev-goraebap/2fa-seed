import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";
import { Timestamp } from "firebase-admin/firestore";
import { FirebaseModel } from "src/shared/third-party";

export class UserSessionModel extends FirebaseModel {

    readonly id: string;
    readonly userId: string;
    readonly deviceId: string;
    readonly deviceModel?: string;
    readonly deviceOs?: string;
    readonly refreshToken?: string;
    readonly refreshTokenExpiryDate?: Date;
    readonly lastRefreshingDate?: Date;

    private static readonly REFRESH_EXPIRES_TIME: number = 7 * 24 * 60 * 60 * 1000; //7일

    static from(param: Pick<UserSessionModel, 'userId' | 'deviceId' | 'deviceModel' | 'deviceOs' | 'refreshToken'>): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            id: `${param.userId}:${param.deviceId}`,
            userId: param.userId,
            deviceId: param.deviceId,
            deviceModel: param.deviceModel,
            deviceOs: param.deviceOs,
            refreshToken: param.refreshToken,
            refreshTokenExpiryDate: new Date(Date.now() + UserSessionModel.REFRESH_EXPIRES_TIME),
            lastRefreshingDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        } as UserSessionModel);
    }

    static fromFirebase(param: OnlyProps<UserSessionModel>): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
            refreshTokenExpiryDate: param.refreshTokenExpiryDate ? (param.refreshTokenExpiryDate as unknown as Timestamp).toDate() : null,
            lastRefreshingDate: param.lastRefreshingDate ? (param.lastRefreshingDate as unknown as Timestamp).toDate() : null,
        } as UserSessionModel);
    }

    withUpdateRefreshToken(refreshToken: string): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            ...this,
            refreshToken,
            refreshTokenExpiryDate: new Date(Date.now() + UserSessionModel.REFRESH_EXPIRES_TIME),
            lastRefreshingDate: new Date(),
            updatedAt: new Date()
        } as UserSessionModel);
    }
}