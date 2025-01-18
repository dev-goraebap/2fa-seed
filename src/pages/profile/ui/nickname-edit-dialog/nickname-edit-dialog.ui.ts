import { Component, effect, inject, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notyf } from 'notyf';

import { ProfileState, USER_RULES } from 'src/entities/user';
import { BaseForm, DynamicDialogControl } from 'src/shared/foundations';
import { ToFormGroup } from 'src/shared/types';

import { NicknameEditState } from '../../states/nickname-edit.state';

@Component({
    selector: 'nickname-edit-dialog',
    templateUrl: 'nickname-edit-dialog.ui.html',
    imports: [
        ReactiveFormsModule,
    ],
})
export class NicknameEditDialogUI extends BaseForm {

    override readonly formGroup: FormGroup<ToFormGroup<{ nickname: string }>>;
    readonly isPending: Signal<boolean>;
    readonly userRules = USER_RULES;

    private readonly fb = inject(FormBuilder);
    private readonly ddc = inject(DynamicDialogControl);
    private readonly profileState = inject(ProfileState);
    private readonly nicknameEditState = inject(NicknameEditState);

    constructor() {
        super();

        this.isPending = this.nicknameEditState.isPending;

        const currentNickname: string = this.ddc.getData<{ nickname: string }>().nickname;

        this.formGroup = this.fb.group({
            nickname: this.fb.nonNullable.control(currentNickname, [
                Validators.required,
                Validators.minLength(USER_RULES.nickname.min),
                Validators.maxLength(USER_RULES.nickname.max),
                Validators.pattern(USER_RULES.nickname.regex),
            ]),
        });

        effect(() => this.handleNicknameUpdateSuccess());
        effect(() => this.handleNicknameUpdateError());
    }

    onSubmit() {
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

    private handleNicknameUpdateSuccess() {
        const data = this.nicknameEditState.data();
        if (!data) return;

        this.profileState.setData(data);

        new Notyf().success({
            message: '닉네임이 변경되었습니다.',
            dismissible: true,
        });

        this.ddc.close();
        this.nicknameEditState.setData(null);
    }

    private handleNicknameUpdateError() {
        const error = this.nicknameEditState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true,
        });
    }
}
