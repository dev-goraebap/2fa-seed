import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthResultDTO, AuthService, DeviceDTO, EmailDuplicateCheckResultDTO, LoginDTO, RegisterDTO, RetryOtpDTO, UserModel, VerifyOtpDTO } from "src/app/user";

import { ApiDeviceIdHeader, ApiDeviceInfoHeaders, ApiRefreshTokenHeader, Credential, DeviceHeaderDTO, DeviceId, Public, RefreshToken } from "../decorators";
import { EmailValidationPipe } from "../pipes";

/**
 * @description 
 * 일반 인증 관련 API 컨트롤러
 */
@Controller({ path: 'auth', version: '1' })
@ApiTags('일반인증')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Get('check-email-duplicate/:email')
    @ApiOperation({ summary: '이메일 중복 검증' })
    @ApiResponse({ status: HttpStatus.OK, type: EmailDuplicateCheckResultDTO, description: '이메일 중복 여부' })
    async checkEmailDuplicate(@Param('email', EmailValidationPipe) email: string): Promise<EmailDuplicateCheckResultDTO> {
        const isDuplicate = await this.authService.checkEmailDuplicate(email);
        return EmailDuplicateCheckResultDTO.from(isDuplicate);
    }

    @Public()
    @Post('login')
    @ApiOperation({ summary: '로그인' })
    @ApiDeviceIdHeader()
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: '로그인 성공, status 타입 참고' })
    async login(@DeviceId() deviceId: string, @Body() dto: LoginDTO): Promise<AuthResultDTO> {
        return await this.authService.login(deviceId, dto);
    }

    @Public()
    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiDeviceIdHeader()
    @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공(OTP 인증 연계 필요)' })
    async register(@DeviceId() deviceId: string, @Body() dto: RegisterDTO): Promise<void> {
        return await this.authService.register(deviceId, dto);
    }

    @Public()
    @Post('verify-otp')
    @ApiOperation({ summary: 'OTP 인증' })
    @ApiDeviceInfoHeaders()
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: 'OTP 인증 성공' })
    async verifyOtp(@DeviceHeaderDTO() device: DeviceDTO, @Body() dto: VerifyOtpDTO): Promise<AuthResultDTO> {
        return await this.authService.verifyOtp(device, dto);
    }

    @Public()
    @Post('retry-otp')
    @ApiOperation({ summary: 'OTP 재발급' })
    @ApiDeviceIdHeader()
    @ApiResponse({ status: HttpStatus.OK })
    async retryOtp(@DeviceId() deviceId: string, @Body() dto: RetryOtpDTO): Promise<void> {
        return await this.authService.retryOtp(deviceId, dto);
    }

    @Public()
    @Post('refresh')
    @ApiRefreshTokenHeader()
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: '토큰 재발급 성공' })
    async refreshTokens(@RefreshToken() refreshToken: string): Promise<AuthResultDTO> {
        return await this.authService.refresh(refreshToken);
    }

    @Post('logout')
    @ApiDeviceIdHeader()
    @ApiBearerAuth()
    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: HttpStatus.OK, description: '로그아웃 성공' })
    async logout(@DeviceId() deviceId: string, @Credential() user: UserModel): Promise<void> {
        return await this.authService.logout(deviceId, user);
    }
}