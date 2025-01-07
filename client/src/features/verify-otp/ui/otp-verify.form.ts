import { Component, inject, input, InputSignal, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { CreateDeviceDTO, USER_RULES } from "domain-shared/user";
import { Browser } from "src/shared/libs/browser";
import { BaseForm } from "src/shared/libs/base-form";
import { ToFormGroup } from "src/shared/types";
import { OtpVerifyState } from "../states/otp-verify.state";

@Component({
    selector: 'otp-verify-form',
    templateUrl: './otp-verify.form.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class OtpVerifyForm extends BaseForm {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly otpVerifyState: OtpVerifyState = inject(OtpVerifyState);
    
    protected readonly userRules = USER_RULES;
    protected readonly isPending: Signal<boolean> = this.otpVerifyState.isPending;
    protected override formGroup: FormGroup<ToFormGroup<{ otp: string }>>;

    readonly email: InputSignal<string> = input.required();

    constructor() {
        super();
        this.formGroup = this.fb.group({
            otp: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern(USER_RULES.otp.regex)
            ])
        });
    }

    protected onVerifyOtp(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        const { otp } = this.formGroup.getRawValue();
        const deviceId: string = Browser.getId();
        const deviceModel: string = Browser.getBrowserInfo();
        const deviceOs: string = Browser.getOSInfo();
        const dto: CreateDeviceDTO = {
            email: this.email(),
            otp,
            deviceId,
            deviceModel,
            deviceOs
        };
        this.otpVerifyState.verifyOtp(dto).subscribe();
    }
}