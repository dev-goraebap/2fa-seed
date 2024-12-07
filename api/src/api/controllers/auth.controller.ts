import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AuthService, LoginDTO, RegisterDTO } from "src/app/user";

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
    async login(@Body() dto: LoginDTO) {
        console.log(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiOperation({ summary: '회원가입' })
    async register(
        @Req() req: Request,
        @Body() dto: RegisterDTO
    ): Promise<void> {
        console.log(req.headers);
        await this.authService.register(dto);
    }
}