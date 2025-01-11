import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { USER_RULES } from "domain-shared/user";
import { BaseForm } from "src/shared/foundations/form";
import { StepControl } from "src/shared/foundations/stepper";
import { ToFormGroup } from "src/shared/types";

/**
 * @description
 * OTP Verify Form 과 동일하지만, 요구사항이 다르기 때문에 임시로 분리된 폼.
 * 이후에 더 나은 방법으로 리팩토링 필요.
 */
@Component({
    selector: 'otp-form',
    templateUrl: './otp.form.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class OtpForm extends BaseForm {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly stepControl: StepControl = inject(StepControl);

    protected readonly userRules = USER_RULES;
    protected override formGroup: FormGroup<ToFormGroup<{ otp: string }>>;

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

    onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        const { otp } = this.formGroup.getRawValue();
        const data: any = this.stepControl.data();

        this.stepControl.next({
            otp,
            email: data?.email
        });
    }
}