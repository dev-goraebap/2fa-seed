import { Component, inject, output, OutputEmitterRef } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { USER_RULES } from "domain-shared/user";
import { FormHelper } from "src/shared/services";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'otp-verify-form',
    templateUrl: './otp-verify.form.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class OtpVerifyForm extends FormHelper {

    readonly verifyOtpEvent: OutputEmitterRef<string> = output();

    protected override formGroup: FormGroup<ToFormGroup<{ otp: string }>>;
    protected readonly userRules = USER_RULES;

    private readonly fb: FormBuilder = inject(FormBuilder);

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
        this.changeToFetching();
        const { otp } = this.formGroup.getRawValue();
        this.verifyOtpEvent.emit(otp);
    }
}