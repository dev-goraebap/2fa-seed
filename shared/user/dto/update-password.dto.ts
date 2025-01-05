export type UpdatePasswordDTO = {
    readonly email: string;
    readonly otp: string;
    readonly password: string;
}