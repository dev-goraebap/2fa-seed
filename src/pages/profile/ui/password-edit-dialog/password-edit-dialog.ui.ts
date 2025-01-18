import { afterNextRender, Component, inject, Signal, viewChild, ViewContainerRef } from '@angular/core';

import { StepControl } from 'src/shared/foundations/stepper';

import { Step01UI } from './step01/step01.ui';
import { Step02UI } from './step02/step02.ui';
import { Step03UI } from './step03/step03.ui';

@Component({
    selector: 'password-edit-dialog',
    template: `
        <ng-container #stepContainer></ng-container>`,
    providers: [StepControl],
})
export class PasswordEditDialogUI {

    private readonly stepControl = inject(StepControl);
    private readonly stepContainerRef = viewChild.required('stepContainer', {
        read: ViewContainerRef,
    });

    constructor() {
        afterNextRender(() => {
            this.stepControl.setContainerRef(this.stepContainerRef());
            this.stepControl.addComponent(Step01UI);
            this.stepControl.addComponent(Step02UI);
            this.stepControl.addComponent(Step03UI);
            this.stepControl.create();
        });
    }
}
