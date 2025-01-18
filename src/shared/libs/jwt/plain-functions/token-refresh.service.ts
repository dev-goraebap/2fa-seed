import { TokenStorage } from "./token.storage";
import { JwtResource } from "./types";

/** 
 * @description
 * 토큰 재발급 요청을 수행하는 서비스
 * - 앱의 최상위 컴포넌트에서 요청할 url 등을 사전에 설정
 * - axios 미들웨어, httpClient 인터셉터 등에서 토큰 재발급 메서드 활용
 */
export class TokenRefreshService {
    /**
     * setting to `initRefreshApi` method
     */
    private refreshApiUrl: string | null = null;

    /**
     * 리프레시 요청 중일 경우 대기하는 요청 구독 목록
     * - 함수의 상세 실행 내용은 구독되는 시점에 결정됨 -> axios 미들웨어, httpClient 인터셉터에서 처리
     * 
     * 함수를 구독하는 주체는 다음 설계 원칙을 따라야함
     *  1. 리프레시 요청 성공시 구독 목록 재요청 처리
     *  2. 리프레시 요청 실패시 요청 없이 종료
     */
    private pendingSubscribers: ((token: string | null) => void)[] = [];

    /** * TokenRefreshService use only singleton */
    private static instance: TokenRefreshService;
    private constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TokenRefreshService();
        }
        return this.instance;
    }
    /** TokenRefreshService use only singleton */

    addPendingSubscriber(subscriber: (token: string | null) => void) {
        this.pendingSubscribers.push(subscriber);
    }

    /**
     * 리프레시 요청에 대한 파라미터 초기화 설정
     * - 앱의 초기화 영역에서 사전 설정해야함
     * - headers, body 주입 등 자유도를 높이려면 추가 작업 필요
     * - 현재는 Authorization: Bearer ${refreshToken} 형식으로 고정
     */
    initRefreshApiUrl(url: string) {
        this.refreshApiUrl = url;
    }

    /**
     * Web API인 `fetch`와 초기 설정된 파라미터를 통해 리프레시 요청
     * 
     * - 해당 메서드는 axios 미들웨어 또는 httpClient 인터셉터등에서 사용해야함
     */
    async refresh(): Promise<void> {
        if (!this.refreshApiUrl) {
            throw new Error('no refresh api params: before call initRefreshApi 😭');
        }

        const tokenStorage: TokenStorage = TokenStorage.getInstance();
        const refreshToken: string | null = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
            throw new Error('not refresh token');
        }

        try {
            const res = await fetch(this.refreshApiUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'x-refresh-token': refreshToken
                }
            });

            if (!res.ok) {
                throw new Error('refresh failed');
            }

            const { accessToken, expiresIn, refreshToken: newRefreshToken }: JwtResource = await res.json();

            if (accessToken && expiresIn && newRefreshToken) {
                await tokenStorage.store({
                    accessToken,
                    expiresIn,
                    refreshToken: newRefreshToken
                });
                this.pendingSubscribers.forEach(subscriber => subscriber(accessToken));
            } else {
                throw new Error('jwt resource is not valid');
            }
        } catch (error) {
            this.pendingSubscribers.forEach(subscriber => subscriber(null));
            await tokenStorage.clearTokens();
            throw error;
        } finally {
            this.pendingSubscribers = [];
        }
    }
}