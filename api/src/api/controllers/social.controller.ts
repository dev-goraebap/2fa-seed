import { Body, Controller, Get, Post, Query, Render, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AuthResultDTO, SocialAuthService, SocialLoginDTO, SocialRegisterDTO } from "src/app/user";
import { GoogleService, KakaoService, OAuthAuthorizedResultDTO, OAuthProfileResultDTO, OAuthProviders } from "src/shared/third-party";

import { Public } from "../decorators";

@Public()
@Controller({ path: 'socials', version: '1' })
@ApiTags('소셜인증')
export class SocialController {

    constructor(
        private readonly kakaoService: KakaoService,
        private readonly googleService: GoogleService,
        private readonly socialAuthService: SocialAuthService
    ) { }

    @Get('kakao/login')
    @ApiOperation({ summary: '카카오로그인페이지로이동' })
    async kakaoLogin(@Res() res: Response): Promise<void> {
        return res.redirect(this.kakaoService.oauthGetLoginUrl());
    }

    @Get('kakao/authorize')
    @ApiOperation({ summary: '카카오로그인->인증코드로토큰발급' })
    @Render('social-authorize-result')
    async kakaoAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedResultDTO> {
        if (!code) {
            return {
                provider: OAuthProviders.KAKAO,
                accessToken: null,
                idToken: null,
                expiresIn: null,
                errMsg: '인증 코드가 제공되지 않았습니다.'
            }
        }
        return await this.kakaoService.oauthAuthorize(code);
    }

    @Get('google/login')
    @ApiOperation({ summary: '구글로그인페이지로이동' })
    async googleLogin(@Res() res: Response) {
        return res.redirect(this.googleService.oauthGetLoginUrl());
    }

    @Get('google/authorize')
    @ApiOperation({ summary: '구글로그인->인증코드로토큰발급' })
    @Render('social-authorize-result')
    async googleAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedResultDTO> {
        if (!code) {
            return {
                provider: OAuthProviders.GOOGLE,
                accessToken: null,
                idToken: null,
                expiresIn: null,
                errMsg: '인증 코드가 제공되지 않았습니다.'
            }
        }
        return await this.googleService.oauthAuthorize(code);
    }

    @Post('login')
    @ApiOperation({ summary: '소셜 로그인' })
    async login(@Body() dto: SocialLoginDTO): Promise<AuthResultDTO> {
        let profile: OAuthProfileResultDTO;
        if (dto.provider === OAuthProviders.KAKAO) {
            profile = await this.kakaoService.oauthGetProfile(dto.accessTokenOrIdToken);
        } else if (dto.provider === OAuthProviders.GOOGLE) {
            profile = await this.googleService.oauthGetProfile(dto.accessTokenOrIdToken);
        }

        return await this.socialAuthService.login(profile.socialId, dto.deviceId);
    }

    @Post('register')
    @ApiOperation({ summary: '소셜 회원가입' })
    async register(@Body() dto: SocialRegisterDTO) {

    }
}