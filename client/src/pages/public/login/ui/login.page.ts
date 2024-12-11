import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, finalize, tap } from "rxjs";

import { Router } from "@angular/router";
import { LoginDTO, VerifyOtpDTO } from 'domain-shared/user';
import { AuthService } from "src/entities/user";
import { LoginForm } from "src/features/user/login";
import { OtpVerifyForm } from "src/features/user/verify-otp";

@Component({
    selector: 'login-page',
    imports: [
        LoginForm,
        OtpVerifyForm
    ],
    template: `
    <div class="p-4">
        @if(!needVerifyOtp()) {
            <login-form 
                [isFetching]="isFetching()" 
                (notify)="login($event)"
            />
        } @else {
            <otp-verify-form 
                [isFetching]="isFetching()" 
                (notify)="verifyOtp($event)"
            />
        }
    </div>
    `
})
export class LoginPage {

    protected readonly isFetching: WritableSignal<boolean> = signal(false);

    /**
     * 현재 로그인 페이지에서 추가로 OTP 인증이 필요한지 판단하는 플래그
     */
    protected readonly needVerifyOtp: WritableSignal<boolean> = signal(false);

    /**
     * OTP 인증 페이지 전환시 로그인 폼 컴포넌트와 폼 데이터가 삭제되므로 임시로 저장해둠
     */
    protected readonly tempLoginFormData: WritableSignal<LoginDTO | undefined> = signal(undefined);

    private readonly snackBar = inject(MatSnackBar);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected login(dto: LoginDTO) {
        this.isFetching.set(true);

        this.authService.login(dto).pipe(
            tap((res) => {
                if (res.code === 'LOGIN_SUCCESS') {
                    this.router.navigateByUrl('/profile');
                } else if (res.code === 'NEED_OTP') {
                    this.tempLoginFormData.set(dto);
                    this.needVerifyOtp.set(true);
                }
            }),
            catchError(err => {
                console.log(err);
                this.snackBar.open(err, '닫기', {
                    duration: 2000
                });
                return EMPTY;
            }),
            finalize(() => this.isFetching.set(false))
        ).subscribe();
    }

    protected verifyOtp(otp: string) {
        this.isFetching.set(true);

        const dto: VerifyOtpDTO = {
            username: this.tempLoginFormData()!.username,
            otp
        };

        this.authService.verifyOtp(dto).pipe(
            tap(_ => this.router.navigateByUrl('/profile')),
            catchError(err => {
                console.log(err);
                this.snackBar.open(err, '닫기', {
                    duration: 2000
                });
                return EMPTY;
            }),
            finalize(() => this.isFetching.set(false))
        ).subscribe();
    }
}