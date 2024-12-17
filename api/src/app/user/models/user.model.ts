import { plainToInstance } from "class-transformer";

import { UserStatus } from "domain-shared/user";
import { comparePassword, hashPassword } from "src/shared/security";
import { BaseFirebaseModel } from "src/shared/third-party";

export class UserModel extends BaseFirebaseModel {

    readonly id: string;
    readonly nickname: string;
    readonly email: string;
    readonly password: string;
    readonly phoneNumber: string;
    readonly otp: string;
    readonly status: UserStatus;

    static create(param: Pick<UserModel, 'id' | 'nickname' | 'email' | 'password' | 'otp'>): UserModel {
        return plainToInstance(UserModel, {
            ...param,
            status: UserStatus.PENDING,
            password: hashPassword(param.password),
        } as UserModel);
    }

    isPending(): boolean {
        return this.status === UserStatus.PENDING;
    }

    comparePassword(password: string): boolean {
        return comparePassword(password, this.password);
    }

    compareOtp(otp: string): boolean {
        if (!this.otp) {
            return false;
        }
        return this.otp === otp;
    }

    withUpdateStatus(status: UserStatus): UserModel {
        return plainToInstance(UserModel, {
            ...this,
            status,
            otp: null
        } as UserModel);
    }
}