import { Component, inject, signal, Signal, viewChild, WritableSignal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { catchError, EMPTY, finalize, tap } from "rxjs";

import { RegisterDTO, VerifyOtpDTO } from 'domain-shared/user';
import { AuthService } from "src/entities/user";
import { RegisterForm } from "src/features/user/register";
import { OtpVerifyForm } from "src/features/user/verify-otp";

@Component({
    selector: 'register-page',
    imports: [
        RegisterForm,
        OtpVerifyForm,
        RouterLink
    ],
    template: `
    <div data-anims="findIn_slideUp" class="p-4">
        @if (!needVerifyOtp()) {
            <div class="text-2xl font-semibold">
                새로운 계정을 만들어보세요. 이메일과 비밀번호만 입력하면 됩니다.
            </div>
            <br/>
            <register-form #registerForm (notify)="register($event)" />
            <br/>
            <div>
                사용중인 계정이 있나요? 바로 <a routerLink="/login" class="text-blue-500">로그인</a> 하러 가요!
            </div>
        } @else {
            <div class="text-2xl font-semibold">
                마지막 단계에요.<br/>
                OTP 코드를 입력해주세요.
            </div>
            <br/>
            <otp-verify-form #otpVerifyForm (notify)="verifyOtp($event)" />
        }
    </div>
    `
})
export class RegisterPage {
    /**
     * 현재 로그인 페이지에서 추가로 OTP 인증이 필요한지 판단하는 플래그
     */
    protected readonly needVerifyOtp: WritableSignal<boolean> = signal(false);

    /**
     * OTP 인증 페이지 전환시 로그인 폼 컴포넌트와 폼 데이터가 삭제되므로 임시로 저장해둠
     */
    private readonly tempRegisterFormData: WritableSignal<RegisterDTO | undefined> = signal(undefined);

    private readonly router: Router = inject(Router);
    private readonly snackBar: MatSnackBar = inject(MatSnackBar);
    private readonly authService: AuthService = inject(AuthService);

    private readonly registerFormEl: Signal<RegisterForm> = viewChild.required('registerForm');
    private readonly otpVerifyFormEl: Signal<OtpVerifyForm> = viewChild.required('otpVerifyForm');

    protected register(dto: RegisterDTO) {
        this.authService.register(dto).pipe(
            tap((res) => {
                if (res.code === 'REGISTER_SUCCESS') {
                    this.router.navigateByUrl('/profile');
                } else if (res.code === 'NEED_OTP') {
                    this.tempRegisterFormData.set(dto);
                    this.needVerifyOtp.set(true);
                }
            }),
            catchError(err => {
                this.snackBar.open(err, '닫기', {
                    duration: 2000
                });
                return EMPTY;
            }),
            finalize(() => this.registerFormEl().completeFetching())
        ).subscribe();
    }

    protected verifyOtp(otp: string) {
        const dto: VerifyOtpDTO = {
            username: this.tempRegisterFormData()!.email,
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