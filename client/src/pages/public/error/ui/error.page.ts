import { Location } from "@angular/common";
import { afterNextRender, Component, inject, signal, WritableSignal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";

@Component({
    selector: 'err-page',
    imports: [
        MatButtonModule
    ],
    template: `
    @if (errMsg(); as errMsg) {
    <div class="motion-opacity-in-[0%] motion-duration-1000 fixed inset-0 flex justify-center items-center">
        <div class="flex flex-col items-center">
            <div>{{errMsg}}</div>
            <button mat-stroked-button class="mt-4" (click)="onClickRetry()">재시도</button>
        </div>
    </div>
    }
    `
})
export class ErrorPage {

    protected readonly errMsg: WritableSignal<string> = signal('');

    private readonly router: Router = inject(Router);
    private readonly location: Location = inject(Location);

    constructor() {
        const state = this.router.getCurrentNavigation()?.extras.state;

        afterNextRender(() => {
            if (!state || !state['message']) {
                window.alert('잘못된 접근입니다.');
                this.router.navigateByUrl('/');
                return;
            }
    
            this.errMsg.set(state['message']);
        });
    }

    onClickRetry() {
        this.location.back();
    }
}