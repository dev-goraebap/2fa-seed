import { UsernameTypes } from "../types";

export type VerifyOtpDTO = {
    readonly username: string;
    readonly otp: string;
    readonly type: UsernameTypes;
}