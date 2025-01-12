import { Component, effect, inject, Signal } from "@angular/core";
import { Router } from "@angular/router";
import { Notyf } from "notyf";

import { CustomError } from "src/shared/foundations";

import { LogoutState } from "../../states/logout.state";

@Component({
    selector: 'logout-button',
    template: `
    <button class="btn btn-outline btn-primary" [disabled]="isPending()" (click)="onLogout()">
        @if (isPending()) {
        <span class="loading loading-spinner motion-preset-focus"></span>
        } @else {
        <span>로그아웃</span>
        }
    </button>
    `
})
export class LogoutButton {
    
    protected isPending: Signal<boolean>;

    private readonly logoutState: LogoutState = inject(LogoutState);
    private readonly router: Router = inject(Router);

    constructor() {
        this.isPending = this.logoutState.isPending;

        effect(() => this.handleLogoutSuccess());
        effect(() => this.handleLogoutError());
    }

    protected onLogout(): void {
        const result = window.confirm('로그아웃 하시겠습니까?');
        if (!result) return;
        this.logoutState.logout().subscribe();
    }

    private handleLogoutSuccess(): void {
        const isCompleted: boolean = this.logoutState.isCompleted();
        if (!isCompleted) return;

        this.router.navigateByUrl('/');
    }

    private handleLogoutError(): void {
        const error: CustomError | null = this.logoutState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true
        });
    }
}