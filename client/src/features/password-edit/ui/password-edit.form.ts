import { Component, inject, input, InputSignal, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { UpdatePasswordDTO, USER_RULES } from "domain-shared/user";
import { FormHelper } from "src/shared/services";
import { ToFormGroup } from "src/shared/types";

import { PasswordEditState } from "../states/password-edit.state";

@Component({
    selector: 'password-edit-form',
    templateUrl: './password-edit.form.html',
    imports: [
        ReactiveFormsModule,
    ]
})
export class NicknameEditForm extends FormHelper {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly passwordEditState: PasswordEditState = inject(PasswordEditState);

    protected override readonly formGroup: FormGroup<ToFormGroup<{ password: string }>>;
    protected readonly isPending: Signal<boolean> = this.passwordEditState.isPending;
    protected readonly userRules = USER_RULES;

    readonly email: InputSignal<string> = input.required();
    readonly otp: InputSignal<string> = input.required();

    constructor() {
        super();
        this.formGroup = this.fb.group({
            password: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.password.min),
                Validators.maxLength(USER_RULES.password.max),
                Validators.pattern(USER_RULES.password.regex),
            ])
        });
    }

    onUpdateNickname() {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const { password } = this.formGroup.getRawValue();
        const dto: UpdatePasswordDTO = {
            password,
            email: this.email(),
            otp: this.otp()
        }
        this.passwordEditState.updatePassword(dto).subscribe();
    }
}