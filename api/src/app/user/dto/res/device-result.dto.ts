import { ApiProperty } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { UserSessionModel } from "../../models/user-session.model";

export class DeviceResultDTO {

    @ApiProperty({ description: '디바이스 식별자' })
    readonly id: string;

    @ApiProperty({ description: '디바이스 모델' })
    readonly model: string;

    @ApiProperty({ description: '디바이스 OS' })
    readonly os: string;

    @ApiProperty({ description: '마지막 로그인 일자' })
    readonly lastLoginDate: Date;

    static from(s: UserSessionModel): DeviceResultDTO {
        return plainToInstance(DeviceResultDTO, {
            id: s.deviceId,
            model: s.deviceModel,
            os: s.deviceOs,
            lastLoginDate: s.lastRefreshingDate
        } as DeviceResultDTO);
    }
}