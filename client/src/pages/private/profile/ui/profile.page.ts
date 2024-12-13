import { NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { UserService } from "src/entities/user";

@Component({
    selector: 'profile-page',
    imports: [
        MatButtonModule,
        RouterLink,
        NgClass
    ],
    template: `
    <div data-anim="slideRight" class="p-4">
        <div class="flex justify-start gap-4">
            <div class="rounded w-24 h-24 bg-blue-500"></div>
            <div>
                <div class="text-xl">고래밥</div>
                <div class="text-sm mt-1">dev.goraebap gmail.com</div>
                <div class="text-sm mt-1">가입일자: 2024-10-10</div>
            </div>
        </div>
        <div class="mt-4">
            <button mat-stroked-button class="w-full" routerLink="/profile/edit">프로필 수정</button>
        </div>
    </div>
    <div class="border-2"></div>
    <div class="flex justify-center p-10">
        <button class="text-red-400 motion" [ngClass]="{
        'motion-preset-confetti': clicked    
    }" (click)="onClick()">회원 탈퇴</button>
    </div>
    `
})
export class ProfilePage {

    clicked = false;
    private readonly userService = inject(UserService);

    onClick() {
        this.clicked = !this.clicked;
    }
}