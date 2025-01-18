import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from 'src/shared/environments';
import { skipAuth } from 'src/shared/libs/jwt';

import { EmailDuplicateCheckResultDTO, ProfileResultDTO, UpdatePasswordDTO } from './dto';

@Injectable({
    providedIn: 'root',
})
export class UserApi {

    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/v1/users`;

    checkDuplicateEmail(email: string) {
        return this.httpClient.get<EmailDuplicateCheckResultDTO>(`${this.apiUrl}/emails/${email}/duplicated`, {
            context: skipAuth(),
        });
    }

    getProfile() {
        return this.httpClient.get<ProfileResultDTO>(`${this.apiUrl}/me`);
    }

    updateNickname(nickname: string) {
        return this.httpClient.patch<ProfileResultDTO>(`${this.apiUrl}/me/nickname`, { nickname });
    }

    updatePassword(dto: UpdatePasswordDTO) {
        return this.httpClient.patch<void>(`${this.apiUrl}/password`, dto, {
            context: skipAuth(),
        });
    }

    withdraw(otp: string) {
        return this.httpClient.delete<void>(`${this.apiUrl}/me`, {
            params: { otp }
        });
    }
}
