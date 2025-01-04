import { Component, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { LoginDTO, USER_RULES } from "domain-shared/user";
import { Browser } from "src/shared/libs/browser";
import { FormHelper } from "src/shared/services";
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
export class LoginForm extends FormHelper {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly loginState: LoginState = inject(LoginState);

    protected readonly isPending: Signal<boolean> = this.loginState.isPending;
    protected readonly formGroup: FormGroup<ToFormGroup<LoginFormDTO>> = this.fb.group({
        email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(USER_RULES.email.regex)]),
        password: this.fb.nonNullable.control('', [Validators.required])
    });

    protected onLogin() {
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