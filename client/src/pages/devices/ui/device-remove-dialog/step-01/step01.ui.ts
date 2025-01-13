import { Component, effect, inject, Signal } from "@angular/core";
import { Notyf } from "notyf";

import { OtpSendState } from "src/features/send-otp";
import { CustomError, DynamicDialogControl } from "src/shared/foundations";
import { StepControl } from "src/shared/foundations/stepper";

@Component({
    selector: 'step01',
    templateUrl: './step01.ui.html',
    providers: [
        OtpSendState
    ]
})
export class Step01UI {

    readonly isPending: Signal<boolean>;
    data!: { email: string, deviceId: string };

    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly otpSendState: OtpSendState = inject(OtpSendState);
    private readonly stepControl: StepControl = inject(StepControl);

    constructor() {
        this.isPending = this.otpSendState.isPending;
        this.data = this.ddc.getData<{ email: string, deviceId: string }>();
        console.log(this.data);

        effect(() => this.handleOtpSentSuccess());
        effect(() => this.handleOtpSentError());
    }

    onClose(): void {
        this.ddc.close();
    }

    onSendOtp(): void {

        this.otpSendState.sendOtp(this.data.email).subscribe();
    }

    /** @description 인증번호 전송 완료 후 다음 단계로 이동 */
    private handleOtpSentSuccess(): void {
        const isComplete: boolean = this.otpSendState.isCompleted();
        if (!isComplete) return;
        setTimeout(() => {
            this.stepControl.next();
        });
    }

    private handleOtpSentError(): void {
        const error: CustomError | null = this.otpSendState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true,
        });
    }
}