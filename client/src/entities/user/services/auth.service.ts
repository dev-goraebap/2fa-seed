import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { AuthResultDTO, LoginDTO, RegisterDTO, VerifyOtpDTO } from "domain-shared/user";
import { tap } from "rxjs";
import { localStorageStrategy } from "src/shared/session/run-outside/local-storage.strategy";

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
        return this.httpClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/login', dto).pipe(
            tap(async res => {
                if (res.accessToken && res.refreshToken) {
                    console.log(res);
                    localStorageStrategy.setAccessToken(res.accessToken);
                    await localStorageStrategy.setRefreshToken(res.refreshToken);
                }
            })
        )
    }

    register(dto: RegisterDTO) {
        return this.httpClient.post<void>('http://localhost:8000/api/v1/auth/register', dto);
    }

    verifyOtp(otp: VerifyOtpDTO) {
        return this.httpClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/verify-otp', otp).pipe(
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
                if (res.accessToken && res.refreshToken) {
                    localStorageStrategy.setAccessToken(res.accessToken);
                    localStorageStrategy.setRefreshToken(res.refreshToken);
                }
            })
        );
    }
}