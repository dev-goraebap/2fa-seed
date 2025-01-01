import { OAuthProviders } from "../interfaces/firebase.repository";

export class OAuthAuthorizedResultDTO {
    readonly provider: OAuthProviders;
    readonly accessToken: string;
    /**
     * Note: 
     * 일부 프로바이더는 인증 완료 이후 ID토큰을 함께 제공
     * 구글은 ID토큰, 엑세스토큰 모두 각각 사용할 수 있지만
     * 애플의 경우 프로필 조회를 ID토큰으로만 조회 가능
     */
    readonly idToken: string;
    /** 엑세스토큰만료시간 (UTC 날짜) */
    readonly expiresIn: number;
    readonly errMsg: string;
}