import { Component, inject } from "@angular/core";

import { DynamicDialogControl } from "src/shared/foundations";

@Component({
    selector: 'email-edit-modal',
    templateUrl: './email-edit.modal.html',
})
export class EmailEditModal {

    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);

    protected onClick(): void {
        this.ddc.open(EmailEditModal);
    }
}