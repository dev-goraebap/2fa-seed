import { NgClass } from '@angular/common';
import { Component, effect, inject, input, Signal } from '@angular/core';
import { Notyf } from 'notyf';
import { interval, tap } from 'rxjs';

import { OtpSendState } from '../states/otp-send.state';

@Component({
    selector: 'otp-retry-timer',
    templateUrl: './otp-retry.timer.html',
    imports: [
        NgClass,
    ],
    providers: [
        OtpSendState,
    ],
})
export class OtpRetryTimer {

    readonly email = input.required<string>();
    readonly isPending: Signal<boolean>;
    canRetryTime = 30;

    private readonly otpSendState: OtpSendState = inject(OtpSendState);

    constructor() {
        this.isPending = this.otpSendState.isPending;

        effect(() => {
            const isCompleted = this.otpSendState.isCompleted();
            if (isCompleted) {
                new Notyf().success({
                    message: '인증번호를 재전송하였습니다.',
                    dismissible: true,
                });
                this.canRetryTime = 30;
            }
        });

        effect(() => {
            const error = this.otpSendState.error();
            if (error) {
                new Notyf().error({
                    message: error.message,
                    dismissible: true,
                });
                this.canRetryTime = 30;
            }
        });

        interval(1000).pipe(
            tap(() => {
                if (this.canRetryTime !== 0) {
                    this.canRetryTime--;
                }
            }),
        ).subscribe();
    }

    onResendOtp(): void {
        this.otpSendState.sendOtp(this.email()).subscribe();
    }
}
