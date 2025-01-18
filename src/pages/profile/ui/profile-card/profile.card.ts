import { DatePipe } from '@angular/common';
import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { ProfileResultDTO } from 'src/entities/user';
import { DynamicDialogControl } from 'src/shared/foundations';

import { NicknameEditDialogUI } from './nickname-edit-dialog/nickname-edit-dialog.ui';
import { PasswordEditDialogUI } from '../password-edit-dialog/password-edit-dialog.ui';

@Component({
    selector: 'profile-card',
    templateUrl: './profile.card.html',
    imports: [
        DatePipe,
    ],
})
export class ProfileCardUI {

    readonly profile: InputSignal<ProfileResultDTO | null> = input.required();
    readonly onEditNavigate: OutputEmitterRef<'nickname' | 'email' | 'password'> = output();

    private readonly ddc = inject(DynamicDialogControl);

    protected onClick(type: 'nickname' | 'password') {
        if (type === 'nickname') {
            this.ddc.open(NicknameEditDialogUI, {
                data: {
                    nickname: this.profile()?.nickname,
                },
            });
        } else if (type === 'password') {
            this.ddc.open(PasswordEditDialogUI, {
                data: {
                    email: this.profile()?.email,
                },
                canBackdropClose: false,
            });
        }
    }
}
