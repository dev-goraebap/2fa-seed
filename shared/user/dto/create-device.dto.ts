export type CreateDeviceDTO = {
    readonly email: string;
    readonly otp: string;
    readonly deviceId: string;
    readonly deviceModel: string;
    readonly deviceOs: string;
}