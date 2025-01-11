import { Component, ComponentRef, effect, inject, Signal } from "@angular/core";
import { Router } from "@angular/router";
import { Notyf } from "notyf";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { CustomError, DynamicDialogControl } from "src/shared/foundations";
import { PendingScreen } from "src/shared/ui";
import { EmailEditModal } from "src/widgets/email-edit-modal";
import { NicknameEditModal } from "src/widgets/nickname-edit-modal";
import { PasswordEditModal } from "src/widgets/password-edit-modal";

import { LogoutState } from "../states/logout.state";
import { DevicesContainer } from "./devices/devices.container";
import { LogoutButton } from "./logout-button/logout.button";
import { ProfileCard } from "./profile-card/profile.card";

@Component({
    selector: 'profile-page',
    templateUrl: './profile.page.html',
    imports: [
        PendingScreen,
        ProfileCard,
        DevicesContainer,
        LogoutButton,
    ],
    providers: [
        LogoutState
    ]
})
export class ProfilePage {

    private readonly router: Router = inject(Router);
    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly profileState: ProfileState = inject(ProfileState);
    private readonly logoutState: LogoutState = inject(LogoutState);

    protected readonly profile: Signal<ProfileResultDTO | null> = this.profileState.data;
    protected readonly isPending: Signal<boolean> = this.profileState.isPending;
    protected readonly error: Signal<CustomError | null> = this.profileState.error;

    constructor() {
        this.profileState.initialize().subscribe();

        effect(() => this.handleLogoutSuccess());
        effect(() => this.handleLogoutError());
    }

    protected onEditNavigate(target: 'nickname' | 'email' | 'password'): void {
        let modalRef: ComponentRef<any>;
        if (target === 'nickname') {
            modalRef = this.ddc.open(NicknameEditModal);
        } else if (target === 'email') {
            modalRef = this.ddc.open(EmailEditModal);
        } else if (target === 'password') {
            modalRef = this.ddc.open(PasswordEditModal);
        }

        const instance = modalRef!.instance;
        instance.afterClosed = (result: any) => {
            console.log('Modal closed with result:', result);
        };
    }

    private handleLogoutSuccess(): void {
        const isCompleted: boolean = this.logoutState.isCompleted();
        if (!isCompleted) return;

        this.router.navigateByUrl('/');
    }

    private handleLogoutError(): void {
        const error: CustomError | null = this.logoutState.error();
        if (!error) return;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}