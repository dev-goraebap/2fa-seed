import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { UserSessionService } from "src/app/user-session";
import { EmailDuplicateCheckResultDTO, ProfileResultDTO, UpdateNicknameDTO, UpdatePasswordDTO, UserModel, UserService, WithdrawDTO } from "src/app/userv2";
import { FirebaseService } from "src/shared/third-party";

import { Credential, Public } from "../decorators";
import { EmailValidationPipe } from "../pipes";

@Controller({ path: 'users', version: '1' })
@ApiTags('회원정보')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly userSessionService: UserSessionService,
        private readonly firebaseService: FirebaseService,
    ) { }

    @Public()
    @Get('emails/:email/duplicated')
    @ApiOperation({ summary: '이메일 중복 검증' })
    @ApiResponse({ status: HttpStatus.OK, type: EmailDuplicateCheckResultDTO, description: '이메일 중복 여부' })
    async checkEmailDuplicate(@Param('email', EmailValidationPipe) email: string): Promise<EmailDuplicateCheckResultDTO> {
        await this.userService.checkEmailDuplicateOrThrow(email);
        return EmailDuplicateCheckResultDTO.from(true);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: '프로필 조회' })
    @ApiResponse({ status: HttpStatus.OK, type: ProfileResultDTO })
    getProfile(@Credential() user: UserModel): ProfileResultDTO {
        return ProfileResultDTO.from(user);
    }

    @Patch('nickname')
    @ApiBearerAuth()
    @ApiOperation({ summary: '닉네임 변경' })
    @ApiResponse({ status: HttpStatus.OK, type: ProfileResultDTO })
    async updateNickname(@Credential() user: UserModel, @Body() dto: UpdateNicknameDTO): Promise<ProfileResultDTO> {
        const updatedUser = await this.userService.updateNickname(user, dto.nickname);
        return ProfileResultDTO.from(updatedUser);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Patch('password')
    @ApiOperation({ summary: '비밀번호 변경 <OTP 연계>' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async updatePassword(@Body() dto: UpdatePasswordDTO): Promise<void> {
        const user = await this.userService.getUserByEmailWithOtpOrThrow(dto.email, dto.otp);
        await this.userService.updatePassword(user, dto.password);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: '회원탈퇴 <OTP 연계>' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async withdraw(@Credential() user: UserModel, @Body() dto: WithdrawDTO): Promise<void> {
        if (!user.verifyOtp(dto.otp)) {
            throw new UnauthorizedException('OTP 코드가 유효하지 않습니다.');
        }

        await this.firebaseService.runInTransaction(async () => {
            await this.userSessionService.remove(user.id);
            await this.userService.withdraw(user);
        });
    }
}