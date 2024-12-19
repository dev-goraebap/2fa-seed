import { plainToInstance } from "class-transformer";
import { nanoid } from "nanoid";

import { OnlyProps } from "domain-shared/base";
import { UserStatus } from "domain-shared/user";
import { Timestamp } from "firebase-admin/firestore";
import { comparePassword, hashPassword } from "src/shared/security";
import { FirebaseModel } from "src/shared/third-party";

export class UserModel extends FirebaseModel {

    static readonly OTP_EXPIRES_TIME: number = 1000 * 60;

    readonly id: string;
    readonly nickname: string;
    readonly email: string;
    readonly password: string;
    readonly phoneNumber: string;
    readonly otp: string;
    readonly otpExpiredAt: Date;
    readonly status: UserStatus;

    static create(param: Pick<UserModel, 'nickname' | 'email' | 'password' | 'otp'>): UserModel {
        return plainToInstance(UserModel, {
            id: nanoid(30),
            nickname: param.nickname,
            email: param.email,
            otp: param.otp,
            otpExpiredAt: new Date(Date.now() + UserModel.OTP_EXPIRES_TIME),
            status: UserStatus.PENDING,
            password: hashPassword(param.password),
        } as UserModel);
    }

    static fromFirebase(param: OnlyProps<UserModel>): UserModel {
        return plainToInstance(UserModel, {
            ...param,
            otpExpiredAt: (param.otpExpiredAt as unknown as Timestamp).toDate(),
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
        });
    }

    isPending(): boolean {
        return this.status === UserStatus.PENDING;
    }

    comparePassword(password: string): boolean {
        return comparePassword(password, this.password);
    }

    checkOtpExpired(): boolean {
        return this.otpExpiredAt.getTime() >= Date.now();
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
        } as UserModel);
    }
}