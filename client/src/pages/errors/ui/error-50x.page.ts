import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CustomError } from "src/shared/services";

@Component({
    selector: 'error-50X-page',
    template: `
    <div class="motion-opacity-in-[0] motion-translate-y-in-[5%] motion-duration-[0.7s] motion-ease-in-out sm:mt-10">
        <div class="flex flex-col gap-1 items-center">
            <div class="w-full">
                <img src="/imgs/500-error.svg" class="w-full"/>
            </div>
            <div class="text-xl"></div>
            <div class="flex flex-col gap-2">
                <div class="text-lg font-medium">{{error.message}}</div>
                <div class="text-gray-600">잠시 후에 다시 시도해보세요.</div>
            </div>
            <br/>
            <button 
                (click)="onBack()"
                class="btn btn-soft btn-primary">
                재시도
            </button>
        </div>
    </div>
    `
})
export class Error50XPage {

    private readonly router: Router = inject(Router);

    protected readonly error!: CustomError;

    constructor() {
        const state = this.router.getCurrentNavigation()?.extras.state;
        if (!state || !state['error']) {
            window.alert('잘못된 접근입니다.');
            this.router.navigateByUrl('/');
            return;
        }
        this.error = state['error'];
    }

    onBack() {
        this.router.navigateByUrl('/');
    }
}