import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

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
    @ApiOperation({ summary: '회원가입' })
    async register(
        @Body() dto: RegisterDTO,
        @Res() res: Response
    ): Promise<Response> {
        await this.authService.register(dto);
        return res.sendStatus(HttpStatus.ACCEPTED);
    }
}