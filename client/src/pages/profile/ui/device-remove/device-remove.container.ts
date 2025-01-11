import { afterNextRender, Component, inject, Signal, viewChild, ViewContainerRef } from "@angular/core";

import { StepControl } from "src/shared/foundations/stepper";

import { OtpForm } from "./otp-form/otp.form";
import { OtpSendUI } from "./otp-send/otp-send.ui";

@Component({
    selector: 'device-remove-container',
    templateUrl: 'device-remove.container.html',
    providers: [
        StepControl
    ]
})
export class DeviceRemoveContainer {
    private readonly stepContainer: Signal<ViewContainerRef> = viewChild.required('stepContainer', {
        read: ViewContainerRef
    });
    private readonly stepControl: StepControl = inject(StepControl);

    constructor() {
        afterNextRender(() => {
            this.stepControl.setContainerRef(this.stepContainer());
            this.stepControl.addComponent(OtpSendUI);
            this.stepControl.addComponent(OtpForm);
            this.stepControl.create();
        });
    }
}