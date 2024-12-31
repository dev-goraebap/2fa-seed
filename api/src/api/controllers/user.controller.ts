import { Controller, Delete, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ProfileResultDTO, UserModel, UserService, UserSessionModel, UserSessionService } from "src/app/user";

import { Credential } from "../decorators";

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
    getProfile(@Credential() user: UserModel) {
        return ProfileResultDTO.from(user);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '회원탈퇴' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async withdraw(@Credential() user: UserModel) {
        await this.userService.withdraw(user, async () => {
            const userSessions: UserSessionModel[] = await this.userSessionService.getUserSessions(user.id);
            await this.userSessionService.removes(userSessions);
        });
    }
}