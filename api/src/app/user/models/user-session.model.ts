import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";
import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { FirebaseModel } from "src/shared/third-party";
import { generateOTP } from "../utils/generate-otp";

export class UserSessionModel extends FirebaseModel {

    readonly id: string;
    readonly userId: string;
    readonly deviceId: string;
    readonly deviceModel?: string;
    readonly deviceOs?: string;

    readonly isActivated: boolean;
    readonly otp?: string;
    readonly otpExpiryDate?: Date;

    readonly refreshToken?: string;
    readonly refreshTokenExpiryDate?: Date;
    readonly lastRefreshingDate?: Date;

    private static readonly OTP_EXPIRES_TIME: number = 60 * 30 * 1000; // 30분
    private static readonly REFRESH_EXPIRES_TIME: number = 7 * 24 * 60 * 60 * 1000; //7일

    static create(param: Pick<UserSessionModel, 'userId' | 'deviceId'>): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            id: nanoid(30),
            userId: param.userId,
            deviceId: param.deviceId,
            deviceModel: null,
            deviceOs: null,
            isActivated: false,
            otp: generateOTP(),
            otpExpiryDate: new Date(Date.now() + UserSessionModel.OTP_EXPIRES_TIME),
            refreshToken: null,
            refreshTokenExpiryDate: null,
            lastRefreshingDate: null,
        } as UserSessionModel);
    }

    static fromFirebase(param: OnlyProps<UserSessionModel>): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
            otpExpiryDate: param.otpExpiryDate ? (param.otpExpiryDate as unknown as Timestamp).toDate() : null,
            refreshTokenExpiryDate: param.refreshTokenExpiryDate ? (param.refreshTokenExpiryDate as unknown as Timestamp).toDate() : null,
            lastRefreshingDate: param.lastRefreshingDate ? (param.lastRefreshingDate as unknown as Timestamp).toDate() : null,
        } as UserSessionModel);
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

    withUpdateDevice(deviceModel: string, deviceOs: string): UserSessionModel {
        return plainToInstance(UserSessionModel, {
            ...this,
            isActivated: true,
            otp: null,
            otpExpiryDate: null,
            deviceModel,
            deviceOs,
            updatedAt: new Date()
        } as UserSessionModel);
    }

    withUpdateOtp(): UserSessionModel {
        const otp: string = generateOTP();
        return plainToInstance(UserSessionModel, {
            ...this,
            otp,
            otpExpiryDate: new Date(Date.now() + UserSessionModel.OTP_EXPIRES_TIME),
            updatedAt: new Date()
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