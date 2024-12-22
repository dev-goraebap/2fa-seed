import { LocalTokenStorage } from "./storages/local-token.storage";

export class RefreshTokenService {

    private static instance: RefreshTokenService;

    private _isRefreshing: boolean = false;

    private pendingRequests: any[] = [];

    private constructor() { }

    static getInstance(): RefreshTokenService {
        if (!this.instance) {
            this.instance = new RefreshTokenService();
        }
        return RefreshTokenService.instance;
    }

    isRefreshing(): boolean {
        return this._isRefreshing;
    }

    setRefreshing(isRefreshing: boolean): void {
        this._isRefreshing = isRefreshing;
    }

    getPendingRequests(): any[] {
        return this.pendingRequests;
    }

    addPendingRequest(request: any): void {
        this.pendingRequests.push(request);
    }

    clearPendingRequests(): void {
        this.pendingRequests = [];
    }

    async doRefreshTokens() {
        const tokenStorage = LocalTokenStorage.getInstance();

        try {
            const refreshToken = await tokenStorage.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No Refresh Token 😢');
            }

            const res = await fetch('http://localhost:8000/api/v1/auth/refresh', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${refreshToken}`
                }
            });

            if (!res.ok) throw new Error('Refresh Failed 😭');

            const result: any /**프로젝트에서 약속한 타입 사용 */ = await res.json();
            tokenStorage.setAccessToken(result.accessToken, result.expiresIn);
            await tokenStorage.setRefreshToken(result.refreshToken);
        } catch (err) {
            await tokenStorage.clearTokens();
            throw err;
        }
    }
}