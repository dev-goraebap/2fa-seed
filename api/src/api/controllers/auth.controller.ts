import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDTO, RegisterWithEmailDTO } from "src/app/user";

/**
 * @description 
 * 일반 인증 관련 API 컨트롤러
 */
@Controller({ path: 'auth', version: '1' })
@ApiTags('일반 인증')
export class AuthController {

    @Post('login')
    @ApiOperation({ summary: '로그인(이메일 인증 연계)' })
    async login(@Body() dto: LoginDTO) {
        console.log(dto);
    }

    @Post('register')
    @ApiOperation({ summary: '회원가입(이메일 인증 연계)' })
    async register(@Body() dto: RegisterWithEmailDTO) {
        console.log(dto);
    }
}