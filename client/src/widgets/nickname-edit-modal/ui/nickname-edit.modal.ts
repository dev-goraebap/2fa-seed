import { Component, effect, inject } from "@angular/core";
import { Notyf } from "notyf";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { CustomError } from "src/shared/foundations";
import { BaseModal, ModalOverlay } from "src/shared/ui";

import { NicknameEditState } from "../states/nickname-edit.state";
import { NicknameEditForm } from "./nickname-edit-form/nickname-edit.form";

@Component({
    selector: 'nickname-edit-modal',
    templateUrl: './nickname-edit.modal.html',
    imports: [
        ModalOverlay,
        NicknameEditForm
    ],
    providers: [
        NicknameEditState
    ]
})
export class NicknameEditModal extends BaseModal {

    private readonly nicknameEditState: NicknameEditState = inject(NicknameEditState);
    private readonly profileState: ProfileState = inject(ProfileState);

    constructor() {
        super();

        effect(() => this.handleNicknameUpdateSuccess());
        effect(() => this.handleNicknameUpdateError());
    }
    
    private handleNicknameUpdateSuccess(): void {
        const data: ProfileResultDTO | null = this.nicknameEditState.data();
        if (!data) return;

        this.profileState.setData(data);

        const notyf = new Notyf();
        notyf.success({
            message: '닉네임이 변경되었습니다.',
            dismissible: true
        });

        this.close();
    }

    private handleNicknameUpdateError(): void {
        const error: CustomError | null = this.nicknameEditState.error();
        if (!error) return;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}