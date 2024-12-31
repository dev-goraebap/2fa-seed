import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";
import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

import { comparePassword, hashPassword } from "src/shared/security";
import { FirebaseModel } from "src/shared/third-party";
import { generateOTP } from "../utils/generate-otp";

export class UserModel extends FirebaseModel {

    readonly id: string;
    readonly nickname: string;
    readonly email: string;
    readonly password?: string;

    readonly otp?: string;
    readonly otpExpiryDate?: Date;
    private static readonly OTP_EXPIRES_TIME: number = 60 * 5 * 1000; // 5분

    static create(param: Pick<UserModel, 'nickname' | 'email' | 'password'>): UserModel {
        return plainToInstance(UserModel, {
            id: nanoid(30),
            email: param.email,
            password: hashPassword(param.password),
            nickname: param.nickname,
            otp: generateOTP(),
            otpExpiryDate: new Date(Date.now() + UserModel.OTP_EXPIRES_TIME),
        } as UserModel);
    }

    static fromFirebase(param: OnlyProps<UserModel>): UserModel {
        return plainToInstance(UserModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
            otpExpiryDate: param.otpExpiryDate ? (param.otpExpiryDate as unknown as Timestamp).toDate() : null,
        });
    }

    verifyOtp(otp: string): boolean {
        if (otp !== this.otp) {
            return false;
        }

        if (!this.otpExpiryDate || this.otpExpiryDate < new Date()) {
            return false;
        }

        return true;
    }

    verifyPassword(password: string): boolean {
        return comparePassword(password, this.password);
    }

    withUpdateOtp(): UserModel {
        const otp: string = generateOTP();
        return plainToInstance(UserModel, {
            ...this,
            otp,
            otpExpiryDate: new Date(Date.now() + UserModel.OTP_EXPIRES_TIME),
            updatedAt: new Date()
        } as UserModel);
    }
}