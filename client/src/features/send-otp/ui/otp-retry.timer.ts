import { NgClass } from "@angular/common";
import { Component, effect, inject, input, InputSignal, Signal } from "@angular/core";
import { Notyf } from "notyf";
import { interval, tap } from "rxjs";

import { CustomError } from "src/shared/foundations";
import { OtpSendState } from "../states/otp-send.state";

@Component({
    selector: 'otp-retry-timer',
    templateUrl: './otp-retry.timer.html',
    imports: [
        NgClass
    ],
    providers: [
        OtpSendState
    ]
})
export class OtpRetryTimer {

    readonly email: InputSignal<string> = input.required();
    readonly isPending: Signal<boolean>;
    canRetryTime: number = 30;

    private readonly otpSendState: OtpSendState = inject(OtpSendState);

    constructor() {
        this.isPending = this.otpSendState.isPending;

        effect(() => {
            const isCompleted: boolean = this.otpSendState.isCompleted();
            if (isCompleted) {
                new Notyf().success({
                    message: '인증번호를 재전송하였습니다.',
                    dismissible: true
                });
                this.canRetryTime = 30;
            }
        });

        effect(() => {
            const error: CustomError | null = this.otpSendState.error();
            if (error) {
                new Notyf().error({
                    message: error.message,
                    dismissible: true
                });
                this.canRetryTime = 30;
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
        this.otpSendState.sendOtp(this.email()).subscribe();
    }
}