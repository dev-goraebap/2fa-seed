import { NgClass } from "@angular/common";
import { Component, effect, inject, input, InputSignal, Signal } from "@angular/core";
import { Notyf } from "notyf";
import { interval, tap } from "rxjs";

import { CustomError } from "src/shared/libs/base-state";
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

    private readonly otpSendState: OtpSendState = inject(OtpSendState);

    protected canRetryTime: number = 30;
    protected isPending: Signal<boolean> = this.otpSendState.isPending;

    readonly email: InputSignal<string> = input.required();

    constructor() {
        effect(() => {
            const isCompleted: boolean = this.otpSendState.isCompleted();
            if (isCompleted) {
                const notify = new Notyf();
                notify.success({
                    message: '인증번호를 재전송하였습니다.',
                    dismissible: true
                });
                this.canRetryTime = 30;
            }
        });

        effect(() => {
            const error: CustomError | null = this.otpSendState.error();
            if (error) {
                const notify = new Notyf();
                notify.error({
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

    protected onResendOtp(): void {
        this.otpSendState.sendOtp(this.email()).subscribe();
    }
}