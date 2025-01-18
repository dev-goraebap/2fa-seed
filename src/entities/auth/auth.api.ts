import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/libs/jwt';

import { AuthResultDTO, LoginDTO, VerifyOtpDTO } from './dto';

@Injectable({
    providedIn: 'root',
})
export class AuthApi {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/v1/auth`;

    login(dto: LoginDTO) {
        return this.httpClient.post<AuthResultDTO>(`${this.apiUrl}/login`, dto, {
            context: skipAuth(),
        });
    }

    register(dto: LoginDTO) {
        return this.httpClient.post<void>(`${this.apiUrl}/register`, dto, {
            context: skipAuth(),
        });
    }

    sendOtp(email: string) {
        return this.httpClient.post<void>(`${this.apiUrl}/otp/generate`, { email }, {
            context: skipAuth(),
        });
    }

    verifyOtp(dto: VerifyOtpDTO) {
        return this.httpClient.post<AuthResultDTO>(`${this.apiUrl}/otp/verify`, dto, {
            context: skipAuth(),
        });
    }

    logout() {
        return this.httpClient.delete<void>(`${this.apiUrl}/logout`);
    }
}
