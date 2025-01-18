import { Component, inject, input, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { USER_RULES } from 'src/entities/user';
import { BaseForm } from 'src/shared/foundations/form';
import { ToFormGroup } from 'src/shared/types';
import { VerifyOtpDTO } from 'src/entities/auth';

import { OtpVerifyState } from '../../states/otp-verify.state';

@Component({
    selector: 'otp-verify-form',
    templateUrl: './otp-verify.form.html',
    imports: [
        ReactiveFormsModule,
    ],
})
export class OtpVerifyForm extends BaseForm {

    readonly email = input.required<string>();

    override formGroup: FormGroup<ToFormGroup<{ otp: string }>>;
    readonly isPending: Signal<boolean>;
    readonly userRules = USER_RULES;

    private readonly fb = inject(FormBuilder);
    private readonly otpVerifyState = inject(OtpVerifyState);

    constructor() {
        super();
        this.isPending = this.otpVerifyState.isPending;

        this.formGroup = this.fb.group({
            otp: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
            ]),
        });
    }

    onSubmit() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        const { otp } = this.formGroup.getRawValue();
        const dto: VerifyOtpDTO = {
            email: this.email(),
            otp,
        };
        this.otpVerifyState.verifyOtp(dto).subscribe();
    }
}
