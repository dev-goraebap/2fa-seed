import { Component, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { USER_RULES } from "domain-shared/user";
import { FormHelper } from "src/shared/services";
import { ToFormGroup } from "src/shared/types";

import { NicknameEditState } from "../states/nickname-edit.state";

@Component({
    selector: 'nickname-edit-form',
    templateUrl: './nickname-edit.form.html',
    imports: [
    ReactiveFormsModule,
    ]
})
export class NicknameEditForm extends FormHelper {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly nicknameEditState: NicknameEditState = inject(NicknameEditState);

    protected override readonly formGroup: FormGroup<ToFormGroup<{ nickname: string }>>;
    protected readonly isPending: Signal<boolean> = this.nicknameEditState.isPending;
    protected readonly userRules = USER_RULES;

    constructor() {
        super();
        this.formGroup = this.fb.group({
            nickname: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.nickname.min),
                Validators.maxLength(USER_RULES.nickname.max),
                Validators.pattern(USER_RULES.nickname.regex),
            ])
        });
    }

    onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const { nickname } = this.formGroup.getRawValue();
        this.nicknameEditState.updateNickname(nickname).subscribe();
    }
}