import { Component, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { LoginDTO } from "src/entities/auth";
import { USER_RULES } from "src/entities/user";
import { BaseForm } from "src/shared/foundations/form";
import { ToFormGroup } from "src/shared/types";

import { LoginState } from "../../states/login.state";

@Component({
    selector: "login-form",
    templateUrl: "./login.form.html",
    imports: [
        ReactiveFormsModule
    ]
})
export class LoginForm extends BaseForm {

    protected readonly isPending: Signal<boolean>;
    protected readonly formGroup: FormGroup<ToFormGroup<LoginDTO>>;

    private readonly fb = inject(FormBuilder);
    private readonly loginState = inject(LoginState);

    constructor() {
        super();
        this.isPending = this.loginState.isPending;
        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(USER_RULES.email.regex)]),
            password: this.fb.nonNullable.control('', [Validators.required])
        });
    }

    override onSubmit() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const formData: LoginDTO = this.formGroup.getRawValue();
        this.loginState.login(formData).subscribe();
    }
}
