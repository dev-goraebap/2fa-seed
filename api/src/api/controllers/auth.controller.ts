import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { UserSessionModel, UserSessionService } from "src/app/user-session";
import { LoginDTO, RegisterDTO, SendOtpDTO, UserModel, UserService, VerifyEmailDTO } from "src/app/userv2";
import { AuthTokens, SecureTokenService } from "src/shared/security";
import { FirebaseService, MailService } from "src/shared/third-party";

import { ApiRefreshTokenHeader, Credential, Public, RefreshToken } from "../decorators";

/**
 * @description 
 * 일반 인증 관련 API 컨트롤러
 */
@Controller({ path: 'auth', version: '1' })
@ApiTags('일반인증')
export class AuthController {

    constructor(
        private readonly secureTokenService: SecureTokenService,
        private readonly mailService: MailService,
        private readonly firebaseService: FirebaseService,
        private readonly userService: UserService,
        private readonly userSessionService: UserSessionService,
    ) { }

    @Public()
    @Post('login')
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthTokens })
    async login(@Body() dto: LoginDTO): Promise<AuthTokens> {
        const user: UserModel = await this.userService.getCredentials(dto.email, dto.password);
        const authTokens: AuthTokens = this.secureTokenService.getAuthTokens(user.id);
        await this.userSessionService.createOrUpdate(user.id, authTokens.refreshToken);
        return authTokens;
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공' })
    async register(@Body() dto: RegisterDTO): Promise<void> {
        await this.userService.checkEmailDuplicateOrThrow(dto.email);
        await this.userService.create(dto);
    }

    @Public()
    @Post('otp')
    @ApiOperation({ summary: '이메일로 OTP 발송' })
    @ApiResponse({ status: HttpStatus.OK })
    async sendOtp(@Body() dto: SendOtpDTO): Promise<void> {
        const user: UserModel = await this.userService.getUserByEmailOrThrow(dto.email);
        await this.userService.updateOtp(user);
        await this.mailService.send(dto.email, user.otp);
    }

    @Public()
    @Post('verify-email')
    @ApiOperation({ summary: '이메일 인증' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthTokens })
    async verifyEmail(@Body() dto: VerifyEmailDTO): Promise<AuthTokens> {
        const user: UserModel = await this.userService.getUserByEmailWithOtpOrThrow(dto.email, dto.otp);
        const authTokens: AuthTokens = this.secureTokenService.getAuthTokens(user.id);
        
        return await this.firebaseService.runInTransaction(async () => {
            await this.userService.updateEmailVerified(user);
            await this.userSessionService.createOrUpdate(user.id, authTokens.refreshToken);
            return authTokens;
        });
    }

    @Public()
    @Post('refresh')
    @ApiRefreshTokenHeader()
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthTokens })
    async refreshTokens(@RefreshToken() refreshToken: string): Promise<AuthTokens> {
        const session: UserSessionModel = await this.userSessionService.getSessionOrExpiresThrow(refreshToken);
        const authTokens: AuthTokens = this.secureTokenService.getAuthTokens(session.userId);
        await this.userSessionService.update(session, authTokens.refreshToken);
        return authTokens;
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('logout')
    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthTokens })
    async logout(@Credential() user: UserModel): Promise<void> {
        await this.userSessionService.remove(user.id);
    }
}