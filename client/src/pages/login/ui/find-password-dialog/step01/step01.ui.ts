import { Component, effect, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { USER_RULES } from "domain-shared/user";
import { Notyf } from "notyf";
import { OtpSendState } from "src/features/send-otp";
import { BaseForm, CustomError, DynamicDialogControl } from "src/shared/foundations";
import { StepControl } from "src/shared/foundations/stepper";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'step-01',
    templateUrl: './step01.ui.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class Step01UI extends BaseForm {

    override formGroup: FormGroup<ToFormGroup<{ email: string }>>;
    readonly isPending: Signal<boolean>;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly otpSendState: OtpSendState = inject(OtpSendState);
    private readonly stepControl: StepControl = inject(StepControl);

    constructor() {
        super();
        this.isPending = this.otpSendState.isPending;

        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.pattern(USER_RULES.email.regex)
            ])
        });

        effect(() => this.handleOtpSentSuccess());
        effect(() => this.handleOtpSentError());
    }

    override onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        const { email } = this.formGroup.getRawValue();
        this.otpSendState.sendOtp(email).subscribe();
    }

    onClose(): void {
        this.ddc.close();
    }

    /** @description 인증번호 전송 완료 후 다음 단계로 이동 */
    private handleOtpSentSuccess(): void {
        const isCompleted: boolean = this.otpSendState.isCompleted();
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
            const { email } = this.formGroup.getRawValue();
            this.stepControl.next({
                email
            });
        });
    }

    private handleOtpSentError(): void {
        const error: CustomError | null = this.otpSendState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true
        });
    }
}