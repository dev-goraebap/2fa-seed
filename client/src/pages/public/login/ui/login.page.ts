import { Component, inject, Signal, signal, viewChild, WritableSignal } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, finalize, tap } from "rxjs";

import { Router, RouterLink } from "@angular/router";
import { LoginDTO, VerifyOtpDTO } from 'domain-shared/user';
import { AuthService } from "src/entities/user";
import { LoginForm } from "src/features/user/login";
import { OtpVerifyForm } from "src/features/user/verify-otp";

@Component({
    selector: 'login-page',
    imports: [
        LoginForm,
        OtpVerifyForm,
        RouterLink
    ],
    template: `
    <div data-anim="slideUp" class="p-4">
        @if(!needVerifyOtp()) {
            <div class="text-2xl font-semibold">
                데모앱이에요오.<br/>
                이메일과 비밀번호를 입력하세요.
            </div>
            <br/>
            <login-form #loginForm (notify)="login($event)"/>
            <br/>
            <div class="flex justify-between px-4">
                <a routerLink="/find-password" class="text-blue-500">비밀번호 찾기</a>
                <a routerLink="/register" class="text-blue-500">회원가입</a>
            </div>
        } @else {
            <div class="text-2xl font-semibold">
                이런! 추가인증이 필요해요.<br/>
                OTP 코드를 입력해주세요.
            </div>
            <br/>
            <otp-verify-form #otpVerifyForm (notify)="verifyOtp($event)"/>
        }
    </div>
    `
})
export class LoginPage {
    /**
     * 현재 로그인 페이지에서 추가로 OTP 인증이 필요한지 판단하는 플래그
     */
    protected readonly needVerifyOtp: WritableSignal<boolean> = signal(false);

    /**
     * OTP 인증 페이지 전환시 로그인 폼 컴포넌트와 폼 데이터가 삭제되므로 임시로 저장해둠
     */
    private readonly tempLoginFormData: WritableSignal<LoginDTO | undefined> = signal(undefined);

    private readonly router: Router = inject(Router);
    private readonly snackBar: MatSnackBar = inject(MatSnackBar);
    private readonly authService: AuthService = inject(AuthService);

    private readonly loginFormEl: Signal<LoginForm> = viewChild.required('loginForm');
    private readonly otpVerifyFormEl: Signal<OtpVerifyForm> = viewChild.required('otpVerifyForm');

    protected login(dto: LoginDTO) {
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
            finalize(() => this.loginFormEl().completeFetching())
        ).subscribe();
    }

    protected verifyOtp(otp: string) {
        const dto: VerifyOtpDTO = {
            email: this.tempLoginFormData()!.username,
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
            finalize(() => this.otpVerifyFormEl().completeFetching())
        ).subscribe();
    }
}