import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosHeaders } from "axios";

import { EnvConfig } from "src/shared/config";

import { OAuthAuthorizedResultDTO, OAuthProfileResultDTO } from "../dto";
import { OAuthProviders } from "../interfaces/firebase.repository";
import { OAuthProvider } from "../interfaces/oauth-provider";

/**
 * Note:
 * API 문서 참고
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
 */
@Injectable()
export class KakaoService implements OAuthProvider {

    private readonly logger = new Logger(KakaoService.name);

    private readonly clientId: string;
    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.clientId = this.configService.get('KAKAO_CLIENT_ID');
        this.redirectUri = this.configService.get('KAKAO_REDIRECT_URI');
    }

    oauthGetLoginUrl(): string {
        let url = 'https://kauth.kakao.com/oauth/authorize?'
        url += `client_id=${this.clientId}`
        url += `&redirect_uri=${this.redirectUri}`
        url += `&response_type=code`;
        return url;
    }

    async oauthAuthorize(code: string): Promise<OAuthAuthorizedResultDTO> {
        const headers = { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' };
        return await axios.post('https://kauth.kakao.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            code,
        }, { headers })
            .then(res => {
                const { access_token, expires_in } = res.data;
                console.log(access_token);
                return {
                    provider: OAuthProviders.KAKAO,
                    accessToken: access_token,
                    idToken: null,
                    expiresIn: expires_in,
                    errMsg: null
                } as OAuthAuthorizedResultDTO;
            })
            .catch(err => {
                this.logger.log(JSON.stringify(err?.response?.data));
                const errResult = err?.response?.data;
                return {
                    provider: OAuthProviders.KAKAO,
                    accessToken: null,
                    idToken: null,
                    expiresIn: null,
                    errMsg: `[${errResult?.error_code}] 카카오 인증 중 오류가 발생했습니다.`
                } as OAuthAuthorizedResultDTO;
            });
    }

    async oauthGetProfile(token: string): Promise<OAuthProfileResultDTO> {
        const headers = new AxiosHeaders();
        headers.setAuthorization(`Bearer ${token}`);
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8');

        const res = await axios.get('https://kapi.kakao.com/v2/user/me', { headers })
            .catch(err => {
                const errResult = err?.response?.data;
                this.logger.log(JSON.stringify(errResult));
                throw new BadRequestException(`카카오 프로필 조회 중 오류가 발생했습니다: ${errResult?.msg}`);
            });
        this.logger.log(JSON.stringify(res.data));
        const { id } = res.data;
        return {
            socialId: String(id),
            email: null,
            nickname: null,
            profileImageUrl: null
        };
    }
}