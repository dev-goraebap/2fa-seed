import { Component, inject, Signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { catchError, EMPTY } from "rxjs";

import { HttpErrorResponse } from "@angular/common/http";
import { ProfileResultDTO } from "domain-shared/user";
import { ProfileCard, UserService } from "src/entities/user";
import { PendingScreen } from "src/shared/ui";

@Component({
    selector: 'profile-page',
    imports: [
        MatButtonModule,
        RouterLink,
        ProfileCard,
        PendingScreen,
    ],
    template: `
    <fetching-screen [isFetched]="isFetched()">
        <div class="p-4 motion-opacity-in-[0] motion-translate-x-in-[-10%] motion-duration-[0.8s] motion-ease-in-out">
            <profile-card [profile]="profile()"/>
            <button mat-stroked-button class="w-full mt-4" routerLink="/profile/edit">프로필 수정</button>
        </div>
        <div class="border-2"></div>
    </fetching-screen>
    `
})
export class ProfilePage {

    private readonly userService: UserService = inject(UserService);
    private readonly router: Router = inject(Router);

    protected readonly isFetched: Signal<boolean> = this.userService.isFetched;
    protected readonly profile: Signal<ProfileResultDTO | undefined> = this.userService.data;

    constructor() {
        this.userService.getProfile().pipe(
            catchError((res: HttpErrorResponse) => {
                // console.error(err.error.message);
                this.router.navigateByUrl('/error', {
                    state: {
                        message: res?.error?.message
                    }
                });
                return EMPTY;
            })
        ).subscribe();
    }
}