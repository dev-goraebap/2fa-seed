import { Injectable } from "@angular/core";
import { delay, of, throwError } from "rxjs";

import { LoginDTO, RegisterDTO, VerifyOtpDTO } from "domain-shared/user";

export type CommonState = {
    isFetching: boolean;
    error: string | null;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    login(dto: LoginDTO) {
        let result = null;

        const result01 = {
            code: 'LOGIN_SUCCESS',
            data: {
                accessToken: 'ACCESS_TOKEN',
                refreshToken: 'REFRESH_TOKEN',
                expiresAt: Date.now() + 3600
            }
        };
        const result02 = {
            code: 'NEED_OTP',
            data: null
        };

        const probability = Math.random();
        if (probability < 0.5) {
            result = result01;
        } else if (probability < 0.8) {
            result = result02;
        } else {
            return throwError(() => '아이디 또는 비밀번호가 틀려요');
        }

        return of(result).pipe(delay(1000));
    }

    register(dto: RegisterDTO) {
        let result = null;
        const result01 = {
            code: 'NEED_OTP',
            data: null
        };

        const probability = Math.random();
        if (probability < 0.5) {
            result = result01;
        } else {
            return throwError(() => '이미 사용중인 아이디에요.');
        }

        return of(result).pipe(delay(1000));
    }

    verifyOtp(otp: VerifyOtpDTO) {
        let result = null;

        const result01 = {
            code: 'VERIFY_OTP_SUCCESS',
            data: {
                accessToken: 'ACCESS_TOKEN',
                refreshToken: 'REFRESH_TOKEN',
                expiresAt: Date.now() + 3600
            }
        };

        const probability = Math.random();
        if (probability < 0.5) {
            result = result01;
        } else {
            return throwError(() => 'OTP 인증에 실패했어요.');
        }

        return of(result).pipe(delay(1000));
    }
}