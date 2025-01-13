import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { USER_RULES } from "domain-shared/user";
import { BaseForm } from "src/shared/foundations/form";
import { StepControl } from "src/shared/foundations/stepper";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'step-02',
    templateUrl: './step02.ui.html',
    imports: [
        ReactiveFormsModule
    ]
})
export class Step02UI extends BaseForm {

    readonly userRules = USER_RULES;
    override formGroup: FormGroup<ToFormGroup<{ otp: string }>>;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly stepControl: StepControl = inject(StepControl);
    private readonly email: string;

    constructor() {
        super();
        this.email = this.stepControl.data()?.email;
        console.log(this.email);
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

        this.stepControl.next({
            otp,
            email: this.email
        });
    }
}