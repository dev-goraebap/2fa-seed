import { JwtResource } from "./types";

/**
 * @description
 * 엑세스토큰, 리프레시토큰을 관리하는 클래스
 * 
 * - 엑세스토큰은 메모리 상에서 관리됨
 * - 리프레시 토큰은 하이브리드웹앱 환경에 사용되는 `@capacitor/preferences` 규격에 맞추기 위해 `Promise` 반환 
 * 
 * @usage
 * singleton 패턴으로 인스턴스 제공
 * `getInstance` 를 통해 최초 생성자 초기화 또는 기존에 생성된 인스턴스 참조
 */
export class TokenStorage {

    private accessToken: string | null = null;
    private expiresIn: number | null = null;
    private readonly refreshTokenKey: string = 'RT';

    /** TokenStorage use only singleton */
    private static instance: TokenStorage;
    private constructor() { }
    static getInstance(): TokenStorage {
        if (!this.instance) {
            this.instance = new TokenStorage();
        }
        return this.instance;
    }
    /** TokenStorage use only singleton */

    isExpiringSoon(): boolean {
        if (!this.expiresIn) {
            return true;
        }

        const expiresIn = this.expiresIn * 1000;
        const fiveMinutes = 5 * 60 * 1000; // 5분을 밀리초로 변환
        const timeUntilExpiry = expiresIn - Date.now();
        console.log('5분', fiveMinutes);
        console.log('토큰 남은 시간', timeUntilExpiry);

        // 만료되었거나 5분 이하로 남은 경우
        return timeUntilExpiry <= fiveMinutes
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    getRefreshToken(): Promise<string | null> {
        const refreshToken = window.localStorage.getItem(this.refreshTokenKey);
        return Promise.resolve(refreshToken);
    }

    store(resource: JwtResource): Promise<void> {
        this.accessToken = resource.accessToken;
        this.expiresIn = resource.expiresIn;
        window.localStorage.setItem(this.refreshTokenKey, resource.refreshToken);
        return Promise.resolve();
    }

    clearTokens(): Promise<void> {
        this.accessToken = null;
        this.expiresIn = null;
        window.localStorage.removeItem(this.refreshTokenKey);
        return Promise.resolve();
    }
}