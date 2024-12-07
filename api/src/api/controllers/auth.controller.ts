import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AuthService, LoginDTO, RegisterDTO, TokenResultDTO, VerifyOtpDTO } from "src/app/user";

/**
 * @description 
 * 일반 인증 관련 API 컨트롤러
 */
@Controller({ path: 'auth', version: '1' })
@ApiTags('일반 인증')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: HttpStatus.OK, type: TokenResultDTO, description: '로그인 성공' })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: '인증완료되지 않음(OTP 인증 연계 필요)' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그인 인증 실패' })
    async login(@Body() dto: LoginDTO) {
        console.log(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: HttpStatus.ACCEPTED, description: '회원가입 성공(OTP 인증 연계 필요)' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
    async register(
        @Req() req: Request,
        @Body() dto: RegisterDTO
    ): Promise<void> {
        console.log(req.headers);
        await this.authService.register(dto);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'OTP 인증' })
    @ApiResponse({ status: HttpStatus.OK, type: TokenResultDTO, description: 'OTP 인증 성공' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '유효성 검사 실패' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'OTP 인증 실패' })
    async verifyOtp(@Body() dto: VerifyOtpDTO): Promise<TokenResultDTO> {
        return await this.authService.verifyOtp(dto);
    }
}