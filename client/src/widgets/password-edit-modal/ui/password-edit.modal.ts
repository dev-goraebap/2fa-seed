import { afterNextRender, Component, inject, Signal, viewChild, ViewContainerRef } from "@angular/core";

import { BaseModal, ModalOverlay } from "src/shared/ui";
import { OtpForm } from "./otp-form/otp.form";
import { OtpSendUI } from "./otp-send/otp-send.ui";

import { StepControl } from "../states/step.control";
import { PasswordEditForm } from "./password-edit-form/password-edit.form";

@Component({
    selector: 'password-edit-modal',
    templateUrl: './password-edit.modal.html',
    imports: [
        ModalOverlay
    ],
    providers: [
        StepControl
    ]
})
export class PasswordEditModal extends BaseModal {

    private readonly stepContainer: Signal<ViewContainerRef> = viewChild.required('stepContainer', {
        read: ViewContainerRef
    });
    private readonly stepControl: StepControl = inject(StepControl);

    constructor() {
        super();
        afterNextRender(() => {
            console.log(this.stepContainer());
            this.stepControl.setContainerRef(this.stepContainer());
            this.stepControl.addComponent(OtpSendUI);
            this.stepControl.addComponent(OtpForm);
            this.stepControl.addComponent(PasswordEditForm);
            this.stepControl.create();
        });
    }
}