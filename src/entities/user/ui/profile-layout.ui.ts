import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notyf } from 'notyf';

import { ProfileState } from '../states/profile.state';

/**
 * @description
 * 프로필 상태를 초기화 하는 컴포넌트
 * - /users/me url 하위의 컴포넌트들 일괄 적용을 위해 사용됩니다.
 */
@Component({
    selector: 'profile-init',
    template: `
        <router-outlet />`,
    imports: [RouterOutlet],
})
export class ProfileLayoutUI {

    private readonly profileState = inject(ProfileState);

    constructor() {
        this.profileState.initialize().subscribe();

        effect(() => this.handleInitProfileData());
        effect(() => this.handleInitProfileError());
    }

    private handleInitProfileData() {
        const profile = this.profileState.data();
        console.log(profile);
    }

    private handleInitProfileError() {
        const error = this.profileState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true,
        });
    }
}
