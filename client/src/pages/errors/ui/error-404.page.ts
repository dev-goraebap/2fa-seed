import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'error-50X-page',
    template: `
    <div data-motion="slideUp" class="p-4 sm:mt-10">
        <div class="flex flex-col gap-1 items-center">
            <div class="w-full">
                <img src="/imgs/404-error.svg" class="w-full"/>
            </div>
            <div class="flex flex-col gap-2">
                <div class="text-lg font-medium">여기엔 아무것도 없네요.</div>
                <div class="text-gray-600">찾으시는 페이지가 삭제되었거나 이동되었을 수 있어요.</div>
            </div>
            <br/>
            <button 
                (click)="onBack()"
                class="btn btn-soft btn-primary">
                홈으로 돌아가기
            </button>
        </div>
    </div>
    `
})
export class Error404Page {

    private readonly router: Router = inject(Router);

    onBack() {
        this.router.navigateByUrl('/');
    }
}