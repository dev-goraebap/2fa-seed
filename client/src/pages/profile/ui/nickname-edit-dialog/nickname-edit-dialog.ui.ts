import { Component, effect, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Notyf } from "notyf";

import { ProfileResultDTO, USER_RULES } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { BaseForm, CustomError, DynamicDialogControl } from "src/shared/foundations";
import { ToFormGroup } from "src/shared/types";

import { NicknameEditState } from "../../states/nickname-edit.state";

@Component({
    selector: 'nickname-edit-dialog',
    templateUrl: 'nickname-edit-dialog.ui.html',
    imports: [
        ReactiveFormsModule,
    ]
})
export class NicknameEditDialogUI extends BaseForm {

    protected override readonly formGroup: FormGroup<ToFormGroup<{ nickname: string }>>;
    protected readonly isPending: Signal<boolean>;
    protected readonly userRules = USER_RULES;

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly profileState: ProfileState = inject(ProfileState);
    private readonly nicknameEditState: NicknameEditState = inject(NicknameEditState);

    constructor() {
        super();

        this.isPending = this.nicknameEditState.isPending;

        this.formGroup = this.fb.group({
            nickname: this.fb.nonNullable.control('', [
                Validators.required,
                Validators.minLength(USER_RULES.nickname.min),
                Validators.maxLength(USER_RULES.nickname.max),
                Validators.pattern(USER_RULES.nickname.regex),
            ])
        });

        effect(() => this.handleNicknameUpdateSuccess());
        effect(() => this.handleNicknameUpdateError());
    }

    onSubmit(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        const { nickname } = this.formGroup.getRawValue();
        this.nicknameEditState.updateNickname(nickname).subscribe();
    }


    onModalClose() {
        this.ddc.close();
    }

    private handleNicknameUpdateSuccess(): void {
        const data: ProfileResultDTO | null = this.nicknameEditState.data();
        if (!data) return;

        this.profileState.setData(data);

        new Notyf().success({
            message: '닉네임이 변경되었습니다.',
            dismissible: true
        });

        this.ddc.close();
    }

    private handleNicknameUpdateError(): void {
        const error: CustomError | null = this.nicknameEditState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true
        });
    }
}