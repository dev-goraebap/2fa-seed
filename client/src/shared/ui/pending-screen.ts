import { Component, input, InputSignal } from "@angular/core";

@Component({
    selector: 'pending-screen',
    template: `
    @if (isPending(); as isPending) {
    <div class="motion-preset-fade-lg flex justify-center items-center h-full bg-white fixed inset-0 z-50">
        <div class="loading loading-spinner"></div>
    </div>
    } @else {
    <ng-content></ng-content>
    }
    `
})
export class PendingScreen {
    readonly isPending: InputSignal<boolean> = input.required();
}