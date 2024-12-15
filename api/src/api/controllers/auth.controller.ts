import { Body, Controller, Get, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AuthResultDTO, AuthService, EmailDuplicateCheckResultDTO, LoginDTO, RegisterDTO, VerifyOtpDTO } from "src/app/user";

import { AuthResultParam, Public, Refresh } from "../decorators";

/**
 * @description 
 * 일반 인증 관련 API 컨트롤러
 */
@Controller({ path: 'auth', version: '1' })
@ApiTags('일반 인증')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Get('check-email-duplicate/:email')
    @ApiOperation({ summary: '이메일 중복 검증' })
    @ApiResponse({ status: HttpStatus.OK, type: EmailDuplicateCheckResultDTO, description: '이메일 중복 여부' })
    async checkEmailDuplicate(@Param('email') email: string): Promise<EmailDuplicateCheckResultDTO> {
        const isDuplicate = await this.authService.checkEmailDuplicate(email);
        return EmailDuplicateCheckResultDTO.from(isDuplicate);
    }

    @Public()
    @Post('login')
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: '로그인 성공, status 타입 참고' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그인 인증 실패' })
    async login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }

    @Public()
    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: HttpStatus.OK, description: '회원가입 성공(OTP 인증 연계 필요)' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
    async register(
        @Req() req: Request,
        @Body() dto: RegisterDTO
    ): Promise<void> {
        console.log(req.headers);
        return await this.authService.register(dto);
    }

    @Public()
    @Post('verify-otp')
    @ApiOperation({ summary: 'OTP 인증' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: 'OTP 인증 성공' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'OTP 인증 실패' })
    async verifyOtp(@Body() dto: VerifyOtpDTO): Promise<AuthResultDTO> {
        return await this.authService.verifyOtp(dto);
    }

    @Refresh()
    @Post('refresh-tokens')
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthResultDTO, description: '토큰 재발급 성공' })
    refreshTokens(@AuthResultParam() dto: AuthResultDTO): AuthResultDTO {
        return dto;
    }
}