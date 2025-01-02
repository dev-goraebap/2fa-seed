import { plainToInstance } from "class-transformer";
import { Timestamp } from "firebase-admin/firestore";

import { OnlyProps } from "domain-shared/base";
import { FirebaseModel, OAuthProviders } from "src/shared/third-party";

export class UserSocialModel extends FirebaseModel {

    readonly id: string;
    readonly userId: string;
    readonly socialId: string;
    readonly provider: OAuthProviders;

    private static readonly REFRESH_EXPIRES_TIME: number = 7 * 24 * 60 * 60 * 1000; //7일

    static from(param: Pick<UserSocialModel, 'userId' | 'socialId' | 'provider'>): UserSocialModel {
        return plainToInstance(UserSocialModel, {
            id: `${param.userId}:${param.socialId}`,
            userId: param.userId,
            socialId: param.socialId,
            provider: param.provider,
            createdAt: new Date(),
            updatedAt: new Date()
        } as UserSocialModel);
    }

    static fromFirebase(param: OnlyProps<UserSocialModel>): UserSocialModel {
        return plainToInstance(UserSocialModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
        } as UserSocialModel);
    }

    withUpdateRefreshToken(refreshToken: string): UserSocialModel {
        return plainToInstance(UserSocialModel, {
            ...this,
            refreshToken,
            refreshTokenExpiryDate: new Date(Date.now() + UserSocialModel.REFRESH_EXPIRES_TIME),
            lastRefreshingDate: new Date(),
            updatedAt: new Date()
        } as UserSocialModel);
    }
}