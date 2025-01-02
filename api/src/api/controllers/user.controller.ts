import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ProfileResultDTO, UpdateNicknameDTO, UserModel, UserService, UserSessionModel, UserSessionService, WithdrawDTO } from "src/app/user";

import { Credential, Public } from "../decorators";

@Controller({ path: 'users', version: '1' })
@ApiTags('회원정보')
@ApiBearerAuth()
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly userSessionService: UserSessionService
    ) { }

    @Get('me')
    @ApiOperation({ summary: '프로필 조회' })
    @ApiResponse({ status: HttpStatus.OK, type: ProfileResultDTO })
    getProfile(@Credential() user: UserModel): ProfileResultDTO {
        return ProfileResultDTO.from(user);
    }

    @Patch('nickname')
    @ApiOperation({ summary: '닉네임 변경' })
    @ApiResponse({ status: HttpStatus.OK, type: ProfileResultDTO })
    async updateNickname(@Credential() user: UserModel, @Body() dto: UpdateNicknameDTO): Promise<ProfileResultDTO> {
        const updatedUser = await this.userService.updateNickname(user, dto.nickname);
        return ProfileResultDTO.from(updatedUser);
    }

    @Public()
    @Patch('password')
    @ApiOperation({ summary: '비밀번호 변경' })
    @ApiResponse({ status: HttpStatus.OK, type: ProfileResultDTO })
    async updatePassword(@Credential() user: UserModel, @Body() dto: UpdateNicknameDTO): Promise<ProfileResultDTO> {
        const updatedUser = await this.userService.updateNickname(user, dto.nickname);
        return ProfileResultDTO.from(updatedUser);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '회원탈퇴 <OTP 연계>' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async withdraw(@Credential() user: UserModel, @Body() dto: WithdrawDTO): Promise<void> {
        await this.userService.withdraw(user, dto, async () => {
            const userSessions: UserSessionModel[] = await this.userSessionService.getUserSessions(user.id);
            await this.userSessionService.removes(userSessions);
        });
    }
}