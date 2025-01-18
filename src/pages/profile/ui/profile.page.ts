import { Component, inject, Signal } from '@angular/core';

import { ProfileResultDTO, ProfileState } from 'src/entities/user';
import { PendingScreen } from 'src/shared/ui';

import { LogoutState } from '../states/logout.state';
import { LogoutButton } from './logout-button/logout.button';
import { ProfileCardUI } from './profile-card/profile.card';

@Component({
    selector: 'profile-page',
    templateUrl: './profile.page.html',
    imports: [
        PendingScreen,
        ProfileCardUI,
        LogoutButton,
    ],
    providers: [
        LogoutState,
    ],
})
export class ProfilePage {

    readonly profile: Signal<ProfileResultDTO | null>;
    readonly isPending: Signal<boolean>;

    private readonly profileState = inject(ProfileState);

    constructor() {
        this.profile = this.profileState.data;
        this.isPending = this.profileState.isPending;
    }
}
