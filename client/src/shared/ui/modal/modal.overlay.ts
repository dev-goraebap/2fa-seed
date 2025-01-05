import { Component } from "@angular/core";

@Component({
    selector: 'modal-overlay',
    template: `
    <div class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
        <div class="bg-base-100 p-4 w-full rounded-none sm:rounded-md sm:max-w-md h-full sm:h-auto
        motion-opacity-in-[0] motion-translate-y-in-[5%] motion-duration-[0.7s] motion-ease-in-out">
            <ng-content></ng-content>
        </div>
    </div>
    `
})
export class ModalOverlay { }