export enum AuthStatus {
    SUCCESS = 'SUCCESS',
    NEED_OTP = 'NEED_OTP',
    NEED_SOCIAL_REGISTER = 'NEED_SOCIAL_REGISTER'
}

export type AuthResultDTO = {
    readonly status: AuthStatus;
    readonly accessToken: string | null;
    readonly expiresIn: number | null;
    readonly refreshToken: string | null;
};