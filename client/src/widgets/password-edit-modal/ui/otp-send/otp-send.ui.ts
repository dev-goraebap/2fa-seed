import { Component, DestroyRef, effect, inject, Signal } from "@angular/core";
import { Notyf } from "notyf";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { OtpSendState } from "src/features/otp";
import { ModalControl } from "src/shared/ui";

import { StepControl } from "../../states/step.control";

@Component({
    selector: 'otp-send',
    templateUrl: './otp-send.ui.html',
    providers: [
        OtpSendState
    ]
})
export class OtpSendUI {

    private readonly destroyRef: DestroyRef = inject(DestroyRef);
    private readonly modalControl: ModalControl = inject(ModalControl);
    private readonly profileState: ProfileState = inject(ProfileState);
    private readonly otpSendState: OtpSendState = inject(OtpSendState);
    private readonly stepControl: StepControl = inject(StepControl);
    private tempEmail!: string;

    protected readonly profile: Signal<ProfileResultDTO | null> = this.profileState.data;
    protected readonly isPending: Signal<boolean> = this.otpSendState.isPending;

    constructor() {
        effect(() => this.handleOtpSent());
    }

    protected onClose(): void {
        this.modalControl.closeLatest();
    }

    protected onSendOtp(): void {
        const profile: ProfileResultDTO | null = this.profile();
        if (!profile || !profile?.email) {
            const notyf = new Notyf();
            notyf.error({
                message: '뭔가 잘못되었어요.',
                dismissible: true
            });
            return;
        }
        this.tempEmail = profile.email;
        this.otpSendState.sendOtp(profile.email).subscribe();
    }

    /** @description 인증번호 전송 완료 후 다음 단계로 이동 */
    private handleOtpSent(): void {
        const isCompleted: boolean = this.otpSendState.isCompleted();
        console.log(isCompleted);
        if (!isCompleted) return;

        /**
         * @issue effect가 작동한 이후 바로 다음 스텝으로 이동하면 문제 발생
         * ERR MSG: view[EFFECTS] is not iterable <-- 해결 못함..
         * 
         * 스텝이동 = 현재 컴포넌트 삭제 + 다음 컴포넌트 생성
         * 추측: effect가 작동한 이후 바로 컴포넌트 삭제되는게 문제인듯
         * 
         * setTimeout으로 비동기 처리해주니 일단 해결됨
         */
        setTimeout(() => {
            this.stepControl.next({
                email: this.tempEmail
            });
        });
    }
}