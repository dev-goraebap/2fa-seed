import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { ProfileResultDTO } from "src/app/user";
import { UserModel } from "src/app/user/models";

import { Credential } from "../decorators";

@Controller({ path: 'users', version: '1' })
@ApiTags('사용자정보')
export class UserController {

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: '내 정보 조회' })
    @ApiOkResponse({ type: ProfileResultDTO })
    @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
    getUserProfile(@Credential() user: UserModel): ProfileResultDTO {
        return ProfileResultDTO.from(user);
    }
}