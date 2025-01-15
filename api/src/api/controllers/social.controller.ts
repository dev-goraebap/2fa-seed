/**
 * @deprecated 사용되지 않음
 */

// @Public()
// @Controller({ path: 'socials', version: '1' })
// @ApiTags('소셜인증')
// export class SocialController {

//     constructor(
//         private readonly kakaoService: KakaoService,
//         private readonly googleService: GoogleService,
//         private readonly socialAuthService: SocialAuthService
//     ) { }

//     @Get('kakao/login')
//     @ApiOperation({ summary: '카카오로그인페이지로이동' })
//     async kakaoLogin(@Res() res: Response): Promise<void> {
//         return res.redirect(this.kakaoService.oauthGetLoginUrl());
//     }

//     @Get('kakao/authorize')
//     @ApiOperation({ summary: '카카오로그인->인증코드로토큰발급' })
//     @Render('social-authorize-result')
//     async kakaoAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedResultDTO> {
//         if (!code) {
//             return {
//                 provider: OAuthProviders.KAKAO,
//                 accessToken: null,
//                 idToken: null,
//                 expiresIn: null,
//                 errMsg: '인증 코드가 제공되지 않았습니다.'
//             }
//         }
//         return await this.kakaoService.oauthAuthorize(code);
//     }

//     @Get('google/login')
//     @ApiOperation({ summary: '구글로그인페이지로이동' })
//     async googleLogin(@Res() res: Response) {
//         return res.redirect(this.googleService.oauthGetLoginUrl());
//     }

//     @Get('google/authorize')
//     @ApiOperation({ summary: '구글로그인->인증코드로토큰발급' })
//     @Render('social-authorize-result')
//     async googleAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedResultDTO> {
//         if (!code) {
//             return {
//                 provider: OAuthProviders.GOOGLE,
//                 accessToken: null,
//                 idToken: null,
//                 expiresIn: null,
//                 errMsg: '인증 코드가 제공되지 않았습니다.'
//             }
//         }
//         return await this.googleService.oauthAuthorize(code);
//     }

//     @Post('login')
//     @ApiOperation({ summary: '소셜 로그인', description: '새로운 디바이스에서 로그인시 `새로운 디바이스 액세스 API` 연계 필요' })
//     @ApiResponse({ type: AuthResultDTO, description: '로그인 성공 (새로운 디바이스 로그인 시 이메일로 OTP 자동 발송)' })
//     async login(@Body() dto: SocialLoginDTO): Promise<AuthResultDTO> {
//         let profile: OAuthProfileResultDTO;
//         if (dto.provider === OAuthProviders.KAKAO) {
//             profile = await this.kakaoService.oauthGetProfile(dto.accessTokenOrIdToken);
//         } else if (dto.provider === OAuthProviders.GOOGLE) {
//             profile = await this.googleService.oauthGetProfile(dto.accessTokenOrIdToken);
//         }

//         return await this.socialAuthService.login(profile.socialId, dto.deviceId);
//     }

//     @Post('register')
//     @ApiOperation({ summary: '소셜 회원가입', description: '회원가입 성공 시 `새로운 디바이스 액세스 API` 연계 필요' })
//     @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공 (이메일로 OTP 자동 발송)' })
//     async register(@Body() dto: SocialRegisterDTO) {
//         let profile: OAuthProfileResultDTO;
//         if (dto.provider === OAuthProviders.KAKAO) {
//             profile = await this.kakaoService.oauthGetProfile(dto.accessTokenOrIdToken);
//         } else if (dto.provider === OAuthProviders.GOOGLE) {
//             profile = await this.googleService.oauthGetProfile(dto.accessTokenOrIdToken);
//         }

//         return await this.socialAuthService.register(profile.socialId, dto);
//     }
// }