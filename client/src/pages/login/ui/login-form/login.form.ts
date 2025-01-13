import { Component, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { LoginDTO, USER_RULES } from "domain-shared/user";
import { BaseForm } from "src/shared/foundations/form";
import { Browser } from "src/shared/libs/browser";
import { ToFormGroup } from "src/shared/types";

import { LoginState } from "../../states/login.state";
import { LoginFormDTO } from "../../types/login-form.dto";

@Component({
    selector: "login-form",
    templateUrl: "./login.form.html",
    imports: [
        ReactiveFormsModule
    ]
})
export class LoginForm extends BaseForm {

    protected readonly isPending: Signal<boolean>;
    protected readonly formGroup: FormGroup<ToFormGroup<LoginFormDTO>>;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly loginState: LoginState = inject(LoginState);

    constructor() {
        super();
        this.isPending = this.loginState.isPending;
        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(USER_RULES.email.regex)]),
            password: this.fb.nonNullable.control('', [Validators.required])
        });
    }

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