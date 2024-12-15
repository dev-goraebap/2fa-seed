import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { AuthResultDTO, LoginDTO, RegisterDTO, VerifyOtpDTO } from "domain-shared/user";
import { tap } from "rxjs";

export type CommonState = {
    isFetching: boolean;
    error: string | null;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httClient: HttpClient = inject(HttpClient);

    login(dto: LoginDTO) {
        return this.httClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/login', dto).pipe(
            tap(res => {
                console.log(res);
            })
        )
    }

    register(dto: RegisterDTO) {
        return this.httClient.post<void>('http://localhost:8000/api/v1/auth/register', dto);
    }

    verifyOtp(otp: VerifyOtpDTO) {
        return this.httClient.post<AuthResultDTO>('http://localhost:8000/api/v1/auth/verify-otp', otp).pipe(
            tap(res => {
                console.log(res);
            })
        );
    }
}