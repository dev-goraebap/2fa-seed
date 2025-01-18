import { Component, effect, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';

import { LogoutState } from '../../states/logout.state';

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
    `,
})
export class LogoutButton {

    readonly isPending: Signal<boolean>;

    private readonly logoutState = inject(LogoutState);
    private readonly router = inject(Router);

    constructor() {
        this.isPending = this.logoutState.isPending;

        effect(() => this.handleLogoutSuccess());
        effect(() => this.handleLogoutError());
    }

    onLogout() {
        const result = window.confirm('로그아웃 하시겠습니까?');
        if (!result) return;
        this.logoutState.logout().subscribe();
    }

    private handleLogoutSuccess() {
        const isCompleted = this.logoutState.isCompleted();
        if (!isCompleted) return;

        this.router.navigateByUrl('/');
    }

    private handleLogoutError() {
        const error = this.logoutState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true,
        });
    }
}
