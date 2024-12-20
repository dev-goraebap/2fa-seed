export enum AuthStatus {
    SUCCESS = 'SUCCESS',
    NEED_OTP = 'NEED_OTP'
}

export type AuthResultDTO = {
    readonly status: AuthStatus;
    readonly accessToken: string | null;
    readonly expiresIn: number | null;
};