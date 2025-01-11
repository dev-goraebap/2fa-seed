export type DeviceResultDTO = {
    readonly id: string;
    readonly model: string;
    readonly os: string;
    readonly lastLoginDate: Date;
    readonly isCurrentDevice: boolean;
}