import { Component, ComponentRef, effect, inject, Signal } from "@angular/core";
import { Router } from "@angular/router";

import { ProfileResultDTO } from "domain-shared/user";
import { ProfileCard, ProfileState } from "src/entities/user";
import { LogoutButton, LogoutState } from "src/features/logout";
import { CustomError } from "src/shared/services";
import { ModalControl, PendingScreen } from "src/shared/ui";
import { NicknameEditModal } from "src/widgets/nickname-edit-modal";

@Component({
    selector: 'profile-page',
    templateUrl: './profile.page.html',
    imports: [
        LogoutButton,
        ProfileCard,
        PendingScreen,
    ],
    providers: [
        LogoutState
    ]
})
export class ProfilePage {

    private readonly router: Router = inject(Router);
    private readonly modalControl: ModalControl = inject(ModalControl);
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

    protected onEditNavigate(target: 'nickname' | 'email' | 'password'): void {
        /**
         * target에 따라 분기 처리 필요
         * - 현재는 닉네임 수정만 처리
         */
        const modalRef: ComponentRef<any> = this.modalControl.open(NicknameEditModal);
        const instance = modalRef.instance;
        instance.afterClosed = (result: any) => {
            console.log('Modal closed with result:', result);
        };
    }
}