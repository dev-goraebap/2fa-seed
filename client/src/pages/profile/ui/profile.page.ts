import { Component, inject, Signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileState } from "src/entities/user";
import { CustomError, DynamicDialogControl } from "src/shared/foundations";
import { PendingScreen } from "src/shared/ui";

import { LogoutState } from "../states/logout.state";
import { LogoutButton } from "./logout-button/logout.button";
import { ProfileCardUI } from "./profile-card/profile.card";

@Component({
    selector: 'profile-page',
    templateUrl: './profile.page.html',
    imports: [
        RouterLink,
        PendingScreen,
        ProfileCardUI,
        LogoutButton,
    ],
    providers: [
        LogoutState
    ]
})
export class ProfilePage {

    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly profileState: ProfileState = inject(ProfileState);

    protected readonly profile: Signal<ProfileResultDTO | null> = this.profileState.data;
    protected readonly isPending: Signal<boolean> = this.profileState.isPending;
    protected readonly error: Signal<CustomError | null> = this.profileState.error;
}