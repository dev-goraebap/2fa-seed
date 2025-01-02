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
    protected isFetching: boolean = false;

    private readonly fb: FormBuilder = inject(FormBuilder);

    constructor() {
        super();
        this.formGroup = this.fb.group({
            email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(USER_RULES.email.regex)]),
            password: this.fb.nonNullable.control('', [Validators.required])
        });
    }

    /** @description 부모 컴포넌트에서 API 호출 완료 시 사용 */
    updateFetched() {
        this.isFetching = false;
    }

    protected onLogin() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        this.isFetching = true;
        const formData: LoginFormDTO = this.formGroup.getRawValue();
        console.log(formData);
        this.loginEvent.emit(formData);
    }
}