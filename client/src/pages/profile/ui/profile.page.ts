import { DatePipe } from "@angular/common";
import { Component, effect, inject, Signal } from "@angular/core";
import { Router } from "@angular/router";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { LogoutButton, LogoutState } from "src/features/logout";
import { CustomError } from "src/shared/services";
import { PendingScreen } from "src/shared/ui";

@Component({
    selector: 'profile-page',
    templateUrl: './profile.page.html',
    imports: [
        DatePipe,
        LogoutButton,
        PendingScreen
    ],
    providers: [
        LogoutState
    ]
})
export class ProfilePage {

    private readonly router: Router = inject(Router);
    private readonly profileState: ProfileState = inject(ProfileState);
    private readonly logoutState: LogoutState = inject(LogoutState);

    protected readonly profile: Signal<ProfileResultDTO | null> = this.profileState.data;
    protected readonly isPending: Signal<boolean> = this.profileState.isPending;
    protected readonly error: Signal<CustomError | null> = this.profileState.error;

    constructor() {
        this.profileState.initialize().subscribe();

        effect(() => {
            const isCompleted: boolean = this.logoutState.isCompleted();
            if (isCompleted) {
                this.router.navigateByUrl('/');
            }
        });
    }

    onLogoutComplete(): void {
        this.router.navigateByUrl('/');
    }
}