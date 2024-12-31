import { plainToInstance } from "class-transformer";

export class DeviceDTO {
    readonly deviceId: string;
    readonly deviceModel: string;
    readonly deviceOs: string;

    static create(deviceId: string, deviceModel: string, deviceOs: string): DeviceDTO {
        return plainToInstance(DeviceDTO, {
            deviceId,
            deviceModel,
            deviceOs
        } as DeviceDTO);
    }
}