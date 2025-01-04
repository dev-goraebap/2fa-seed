import { NgClass } from "@angular/common";
import { Component, effect, inject, signal, WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { Notyf } from "notyf";
import { interval, tap } from "rxjs";

import { OtpVerifyForm, OtpVerifyState } from "src/features/verify-otp";
import { CustomError } from "src/shared/services";

@Component({
    selector: 'otp-verify-page',
    templateUrl: './otp-verify.page.html',
    imports: [
        OtpVerifyForm,
        NgClass
    ],
    providers: [
        OtpVerifyState
    ]
})
export class OtpVerifyPage {

    private readonly router: Router = inject(Router);
    private readonly otpVerifyState: OtpVerifyState = inject(OtpVerifyState);

    protected readonly email: WritableSignal<string | null> = signal(null);
    protected canRetryTime: number = 30;

    constructor() {
        const state = this.router.getCurrentNavigation()?.extras.state;
        if (!state || !state['email']) {
            window.alert('잘못된 접근입니다.');
            this.router.navigateByUrl('/');
            return;
        }

        this.email.set(state['email']);

        effect(() => {
            const isCompleted: boolean = this.otpVerifyState.isCompleted();
            if (isCompleted) {
                this.router.navigateByUrl('/users/me');
            }
        });

        effect(() => {
            const error: CustomError | null = this.otpVerifyState.error();
            if (error) {
                const notify = new Notyf();
                notify.error({
                    message: error.message,
                    dismissible: true
                });
            }
        });

        interval(1000).pipe(
            tap(() => {
                if (this.canRetryTime !== 0) {
                    this.canRetryTime--;
                }
            })
        ).subscribe();
    }

    onResendOtp(): void {
        // this.authService.sendOtp(this.email).pipe(
        //     tap(() => {
        //         const notify = new Notyf();
        //         notify.success({
        //             message: '인증번호를 재전송하였습니다.',
        //             dismissible: true
        //         });
        //     }),
        //     catchError((res: HttpErrorResponse) => {
        //         const notify = new Notyf();
        //         notify.error({
        //             message: res.error.message,
        //             dismissible: true
        //         });
        //         return EMPTY;
        //     }),
        //     finalize(() => this.canRetryTime = 30),
        // ).subscribe();
    }
}