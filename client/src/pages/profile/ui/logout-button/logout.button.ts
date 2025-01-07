import { Component, inject, Signal } from "@angular/core";

import { LogoutState } from "../../states/logout.state";

@Component({
    selector: 'logout-button',
    template: `
    <button class="btn btn-outline btn-primary" [disabled]="isPending()" (click)="onLogout()">
        @if (isPending()) {
        <span class="loading loading-spinner motion-preset-focus"></span>
        } @else {
        로그아웃
        }
    </button>
    `
})
export class LogoutButton {

    private readonly logoutState: LogoutState = inject(LogoutState);

    protected isPending: Signal<boolean> = this.logoutState.isPending;

    protected onLogout(): void {
        const result = window.confirm('로그아웃 하시겠습니까?');
        if (!result) return;
        this.logoutState.logout().subscribe();
    }
}