import { afterNextRender, Component, inject, Signal, viewChild, ViewContainerRef } from "@angular/core";

import { OtpForm } from "./otp-form/otp.form";
import { OtpSendUI } from "./otp-send/otp-send.ui";

import { StepControl } from "../states/step.control";
import { PasswordEditForm } from "./password-edit-form/password-edit.form";

@Component({
    selector: 'password-edit-modal',
    templateUrl: './password-edit.modal.html',
    providers: [
        StepControl
    ]
})
export class PasswordEditModal {

    private readonly stepContainer: Signal<ViewContainerRef> = viewChild.required('stepContainer', {
        read: ViewContainerRef
    });
    private readonly stepControl: StepControl = inject(StepControl);

    constructor() {
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