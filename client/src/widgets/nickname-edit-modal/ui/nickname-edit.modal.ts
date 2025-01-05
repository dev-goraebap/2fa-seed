import { Component, effect, inject } from "@angular/core";
import { Notyf } from "notyf";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { NicknameEditForm, NicknameEditState } from "src/features/nickname-edit";
import { CustomError } from "src/shared/services";
import { BaseModal, ModalOverlay } from "src/shared/ui";

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

        effect(() => {
            const data: ProfileResultDTO | null = this.nicknameEditState.data();
            if (data) {
                this.profileState.setData(data);
                this.close();
            }
        });

        effect(() => {
            const error: CustomError | null = this.nicknameEditState.error();
            if (error) {
                const notyf = new Notyf();
                notyf.error({
                    message: error.message,
                    dismissible: true
                });
            }
        });
    }

    onCancel() {
        const result = window.confirm('정말 취소하시겠습니까?');
        if (!result) return;
        this.close();
    }
}