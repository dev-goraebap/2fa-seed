import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap } from "rxjs";

import { AuthResultDTO, LoginDTO, RegisterDTO, VerifyOtpDTO } from "domain-shared/user";
import { skipAuth, TokenStorage } from "src/shared/libs/jwt";

export type CommonState = {
    isFetching: boolean;
    error: string | null;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient: HttpClient = inject(HttpClient);

    login(dto: LoginDTO) {
        return this.httpClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/login', dto, { context: skipAuth() }).pipe(
            tap(res => {
                console.log(res);
                if (res.accessToken && res.refreshToken && res.expiresIn) {
                    const storage = TokenStorage.getInstance();
                    storage.store({
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken,
                        expiresIn: res.expiresIn
                    });
                }
            })
        )
    }

    register(dto: RegisterDTO) {
        return this.httpClient.post<void>('http://localhost:8000/api/v1/auth/register', dto, { context: skipAuth() });
    }

    verifyOtp(otp: VerifyOtpDTO) {
        return this.httpClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/verify-otp', otp, {
            context: skipAuth()
        }).pipe(
            tap(res => {
                console.log(res);
            })
        );
    }

    refreshTokens(refreshToken: string) {
        let headers = new HttpHeaders();
        headers = headers.set('authorization', `Bearer ${refreshToken}`);

        return this.httpClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/refresh-tokens', {}, {
            headers
        }).pipe(
            tap(res => {
                console.log(res);
                if (res.accessToken) {

                }
            })
        );
    }
}