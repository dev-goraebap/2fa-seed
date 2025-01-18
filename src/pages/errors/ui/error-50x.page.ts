import { Location, NgOptimizedImage } from '@angular/common';
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

import { CustomError } from "src/shared/foundations";

@Component({
    selector: 'error-50X-page',
    imports: [
        NgOptimizedImage,
    ],
    template: `
        <div data-motion="slideUp" class="p-4 sm:mt-10">
            <div class="flex flex-col gap-1 items-center">
                <div class="w-full">
                    <img ngSrc="/imgs/500-error.svg" class="w-full" height="16" width="16" />
                </div>
                <div class="text-xl"></div>
                <div class="flex flex-col gap-2">
                    <div class="text-lg font-medium">{{ error.message }}</div>
                    <div class="text-gray-600">잠시 후에 다시 시도해보세요.</div>
                </div>
                <br />
                <button
                    (click)="onBack()"
                    class="btn btn-soft btn-primary">
                    재시도
                </button>
            </div>
        </div>
    `,
})
export class Error50XPage {

    readonly error!: CustomError;

    private readonly router = inject(Router);
    private readonly location = inject(Location);

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
        this.location.back();
    }
}
