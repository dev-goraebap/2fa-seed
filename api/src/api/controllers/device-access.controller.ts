import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthResultDTO, CreateDeviceDTO, DeviceResultDTO, LogoutOtherDeviceDTO, UserModel, UserSessionModel, UserSessionService } from "src/app/user";

import { Credential, CurrentSession, Public } from "../decorators";

@Controller({ path: 'devices', version: '1' })
@ApiTags('액세스 및 디바이스 관리')
export class DeviceAccessController {

    constructor(
        private readonly userSessionService: UserSessionService
    ) { }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: '액세스된 디바이스 목록 조회' })
    @ApiResponse({ status: HttpStatus.OK, type: [DeviceResultDTO] })
    async getDevices(@Credential() user: UserModel): Promise<DeviceResultDTO[]> {
        const userSessions: UserSessionModel[] = await this.userSessionService.getUserSessions(user.id);
        return userSessions.map(x => DeviceResultDTO.from(x));
    }

    @Public()
    @Post()
    @ApiOperation({ summary: '새로운 디바이스 액세스 <OTP 연계>' })
    @ApiResponse({ status: HttpStatus.OK, type: [DeviceResultDTO] })
    async create(@Body() dto: CreateDeviceDTO): Promise<AuthResultDTO> {
        return await this.userSessionService.create(dto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: '현재 액세스된 디바이스 로그아웃' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async remove(@CurrentSession() userSession: UserSessionModel): Promise<void> {
        await this.userSessionService.remove(userSession);
    }

    @Delete('other')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: '다른 디바이스 로그아웃 <OTP 연계>' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async removeOther(@CurrentSession() userSession: UserSessionModel, @Body() dto: LogoutOtherDeviceDTO): Promise<void> {
        if (dto.deviceId === userSession.deviceId) {
            throw new BadRequestException('현재 액세스된 기기입니다.');
        }
        const otherUserSession = await this.userSessionService.getUserSessionOrThrow(userSession.userId, dto.deviceId);
        await this.userSessionService.remove(otherUserSession);
    }
}