import { NgClass } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, input, InputSignal } from "@angular/core";
import { Notyf } from "notyf";
import { catchError, EMPTY, finalize, interval, tap } from "rxjs";

import { AuthService } from "src/entities/user";

@Component({
    selector: 'otp-retry-timer',
    templateUrl: './otp-retry.timer.html',
    imports: [
        NgClass
    ]
})
export class OtpRetryTimer {

    private readonly authService: AuthService = inject(AuthService);

    protected canRetryTime: number = 30;
    protected isPending: boolean = false;

    readonly email: InputSignal<string> = input.required();

    constructor() {
        interval(1000).pipe(
            tap(() => {
                if (this.canRetryTime !== 0) {
                    this.canRetryTime--;
                }
            })
        ).subscribe();
    }

    protected onResendOtp(): void {
        this.isPending = true;

        this.authService.sendOtp(this.email()).pipe(
            tap(() => {
                const notify = new Notyf();
                notify.success({
                    message: '인증번호를 재전송하였습니다.',
                    dismissible: true
                });
            }),
            catchError((res: HttpErrorResponse) => {
                const notify = new Notyf();
                notify.error({
                    message: res.error.message,
                    dismissible: true
                });
                return EMPTY;
            }),
            finalize(() => {
                this.canRetryTime = 30;
                this.isPending = false;
            }),
        ).subscribe();
    }
}