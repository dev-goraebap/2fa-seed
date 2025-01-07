import { Component, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { LoginDTO, USER_RULES } from "domain-shared/user";
import { Browser } from "src/shared/libs/browser";
import { BaseForm } from "src/shared/libs/base-form";
import { ToFormGroup } from "src/shared/types";

import { LoginState } from "../states/login.state";
import { LoginFormDTO } from "../types/login-form.dto";

@Component({
    selector: "login-form",
    templateUrl: "./login.form.html",
    imports: [
        ReactiveFormsModule
    ]
})
export class LoginForm extends BaseForm {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly loginState: LoginState = inject(LoginState);

    protected readonly isPending: Signal<boolean> = this.loginState.isPending;
    protected readonly formGroup: FormGroup<ToFormGroup<LoginFormDTO>> = this.fb.group({
        email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(USER_RULES.email.regex)]),
        password: this.fb.nonNullable.control('', [Validators.required])
    });

    override onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const formData: LoginFormDTO = this.formGroup.getRawValue();
        const deviceId: string = Browser.getId();
        const loginDTO: LoginDTO = {
            ...formData,
            deviceId
        }
        this.loginState.login(loginDTO).subscribe();
    }
}