import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthResultDTO, AuthService, EmailDuplicateCheckResultDTO, LoginDTO, RegisterDTO, RetryOtpDTO } from "src/app/user";

import { ApiRefreshTokenHeader, Public, RefreshToken } from "../decorators";
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
    @ApiOperation({ summary: '로그인', description: '새로운 디바이스에서 로그인시 `새로운 디바이스 액세스 API` 연계 필요' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: '로그인 성공 (새로운 디바이스 로그인 시 이메일로 OTP 자동 발송)' })
    async login(@Body() dto: LoginDTO): Promise<AuthResultDTO> {
        return await this.authService.login(dto);
    }

    @Public()
    @Post('register')
    @ApiOperation({ summary: '회원가입', description: '회원가입 성공 시 `새로운 디바이스 액세스 API` 연계 필요' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공 (이메일로 OTP 자동 발송)' })
    async register(@Body() dto: RegisterDTO): Promise<void> {
        return await this.authService.register(dto);
    }

    @Public()
    @Post('otp')
    @ApiOperation({
        summary: '이메일로 OTP 발송', description: `
    일부 OTP 코드를 필요로한 API 호출과 연계 시 사용
    - OTP 재발급이 필요한 경우
    - OTP 인증을 필요로 하는 API 사용 전 호출
    `})
    @ApiResponse({ status: HttpStatus.OK })
    async retryOtp(@Body() dto: RetryOtpDTO): Promise<void> {
        return await this.authService.generateOtp(dto);
    }

    @Public()
    @Post('refresh')
    @ApiRefreshTokenHeader()
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: '토큰 재발급 성공' })
    async refreshTokens(@RefreshToken() refreshToken: string): Promise<AuthResultDTO> {
        console.log(refreshToken);
        return await this.authService.refresh(refreshToken);
    }
}