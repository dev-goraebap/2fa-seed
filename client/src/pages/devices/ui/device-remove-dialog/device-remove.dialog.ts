import { afterNextRender, Component, inject, Signal, viewChild, ViewContainerRef } from "@angular/core";

import { StepControl } from "src/shared/foundations/stepper";

import { Step01UI } from "./step-01/step01.ui";
import { Step02UI } from "./step-02/step02.ui";

@Component({
    selector: 'device-remove-container',
    templateUrl: 'device-remove.dialog.html',
    providers: [
        StepControl
    ]
})
export class DeviceRemoveDialog {

    private readonly stepControl: StepControl = inject(StepControl);

    private readonly stepContainer: Signal<ViewContainerRef> = viewChild.required('stepContainer', {
        read: ViewContainerRef
    });

    constructor() {
        afterNextRender(() => {
            this.stepControl.setContainerRef(this.stepContainer());
            this.stepControl.addComponent(Step01UI);
            this.stepControl.addComponent(Step02UI);
            this.stepControl.create();
        });
    }
}