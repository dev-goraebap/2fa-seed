import { Component, effect, inject, Signal } from "@angular/core";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { OtpForm, OtpSendState, OtpVerifyState } from "src/features/otp";
import { BaseModal, ModalOverlay } from "src/shared/ui";

@Component({
    selector: 'otp-verify-modal',
    templateUrl: './otp-verify.modal.html',
    imports: [
        ModalOverlay,
        OtpForm
    ],
    providers: [
        OtpVerifyState,
        OtpSendState
    ]
})
export class OtpVerifyModal extends BaseModal {

    private readonly profileState: ProfileState = inject(ProfileState);
    private readonly otpVerifyState: OtpVerifyState = inject(OtpVerifyState);
    private readonly otpSendState: OtpSendState = inject(OtpSendState);

    protected readonly profile: Signal<ProfileResultDTO | null> = this.profileState.data;
    protected readonly isOtpSendPending: Signal<boolean> = this.otpSendState.isPending;
    protected step: 'send' | 'form' = 'send';

    constructor() {
        super();
        effect(() => this.handleOtpSendSuccess());
    }

    protected onCancel(): void {
        const result = window.confirm('정말 취소하시겠습니까?');
        if (!result) return;
        this.close();
    }

    protected onSendOtp(): void {
        this.otpSendState.sendOtp(this.profile()!.email).subscribe();
    }

    protected onReceiveOtp(otp: string): void {

    }

    private handleOtpSendSuccess(): void {
        const isCompleted: boolean = this.otpSendState.isCompleted();
        if (!isCompleted) return;
        // OTP 전송 완료시 폼 화면으로 전환
        this.step = 'form';
    }
}