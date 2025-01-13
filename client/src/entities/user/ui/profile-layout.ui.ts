import { Component, effect, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Notyf } from "notyf";

import { ProfileResultDTO } from "domain-shared/user";
import { CustomError } from "src/shared/foundations";

import { ProfileState } from "../states/profile.state";

/**
 * @description 
 * 프로필 상태를 초기화 하는 컴포넌트
 * - /users/me url 하위의 컴포넌트들 일괄 적용을 위해 사용됩니다.
 */
@Component({
    selector: 'profile-init',
    template: `<router-outlet/>`,
    imports: [RouterOutlet]
})
export class ProfileLayoutUI {

    private readonly profileState: ProfileState = inject(ProfileState);

    constructor() {
        this.profileState.initialize().subscribe();

        effect(() => this.handleInitProfileData());
        effect(() => this.handleInitProfileError());
    }

    private handleInitProfileData(): void {
        const profile: ProfileResultDTO | null = this.profileState.data();
    }

    private handleInitProfileError(): void {
        const error: CustomError | null = this.profileState.error();
        if (!error) return;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}