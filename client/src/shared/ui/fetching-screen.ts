import { Component, input, InputSignal } from "@angular/core";

@Component({
    selector: 'fetching-screen',
    template: `
    @if (!isFetched()) {
    <div class="motion-preset-fade-lg flex justify-center items-center h-full bg-white fixed inset-0 z-50">
        <div class="text-xs motion-preset-oscillate">프로필 정보를 불러오는 중입니다.</div>
    </div>
    } @else {
    <ng-content></ng-content>
    }
    `
})
export class FetchingScreen {
    readonly isFetched: InputSignal<boolean> = input.required();
}