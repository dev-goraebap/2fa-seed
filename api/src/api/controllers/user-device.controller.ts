import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DeviceResultDTO, UserModel, UserSessionModel, UserSessionService } from "src/app/user";

import { Credential } from "../decorators";

@Controller({ path: 'devices', version: '1' })
@ApiTags('회원 디바이스 관리')
@ApiBearerAuth()
export class UserDeviceController {

    constructor(
        private readonly userSessionService: UserSessionService
    ) { }

    @Get()
    @ApiOperation({ summary: '디바이스 목록 조회' })
    @ApiResponse({ status: HttpStatus.OK, type: [DeviceResultDTO] })
    async getDevices(@Credential() user: UserModel): Promise<DeviceResultDTO[]> {
        const userSessions: UserSessionModel[] = await this.userSessionService.getUserSessions(user.id);
        return userSessions.map(x => DeviceResultDTO.from(x));
    }
}