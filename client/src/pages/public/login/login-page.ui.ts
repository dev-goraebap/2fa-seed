import { Component, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'login-page',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        RouterLink
    ],
    template: `
    <div class="flex flex-col p-4">
        <mat-form-field>
            <mat-label>username</mat-label>
            <input matInput type="text" />
        </mat-form-field>
        <mat-form-field>
            <mat-label>password</mat-label>
            <input matInput [type]="hide() ? 'password' : 'text'" />
            <button
            mat-icon-button
            matSuffix
            (click)="clickEvent($event)"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hide()"
            >
            <mat-icon class="mr-2">{{hide() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
        </mat-form-field>

        <button mat-flat-button>로그인</button>

        <div class="flex justify-around mt-4">
            <a routerLink="/">아이디/비밀번호 찾기</a>
            <a routerLink="/register">회원가입</a>
        </div>

        <div class="flex justify-center w-full">
            <div class="w-[70%] border-gray-500 border-t my-8"></div>
        </div>

        <div class="flex justify-center gap-2">
            <a>
                <img src="kakao_login.png"/>
            </a>
            <a>
                <img src="google_login.png"/>
            </a>
        </div>
        
    </div>
    `,
})
export class LoginPageUI {
    readonly hide = signal(true);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }
}