import { Component } from "@angular/core";

@Component({
    selector: 'modal-overlay',
    template: `
    <div class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center motion-preset-fade">
        <div class="bg-base-100 p-4 w-full rounded-none sm:rounded-md sm:max-w-md h-full sm:h-auto
        motion-preset-expand motion-duration-200 motion-delay-200">
            <ng-content></ng-content>
        </div>
    </div>
    `
})
export class ModalOverlay { }