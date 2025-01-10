import { Component, inject } from "@angular/core";
import { ModalControl, ModalOverlay } from "src/shared/ui";

@Component({
    selector: 'email-edit-modal',
    templateUrl: './email-edit.modal.html',
    imports: [
        ModalOverlay
    ],
})
export class EmailEditModal {

    private readonly modalControl: ModalControl = inject(ModalControl);

    protected onClick(): void {
        this.modalControl.open(EmailEditModal);
    }
}