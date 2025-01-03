import { Component, inject, output, OutputEmitterRef } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { FormHelper } from "src/shared/services";
import { ToFormGroup } from "src/shared/types";

import { USER_RULES } from "domain-shared/user";
import { LoginFormDTO } from "../types/login-form.dto";

@Component({
    selector: "login-form",
    templateUrl: "./login.form.html",
    imports: [
        ReactiveFormsModule
    ],
})
export class LoginForm extends FormHelper {

    readonly loginEvent: OutputEmitterRef<LoginFormDTO> = output();

    protected readonly formGroup: FormGroup<ToFormGroup<LoginFormDTO>>;

    private readonly fb: FormBuilder = inject(FormBuilder);

    constructor() {
        super();
        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(USER_RULES.email.regex)]),
            password: this.fb.nonNullable.control('', [Validators.required])
        });
    }

    protected onLogin() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        this.changeToFetching();
        const formData: LoginFormDTO = this.formGroup.getRawValue();
        console.log(formData);
        this.loginEvent.emit(formData);
    }
}