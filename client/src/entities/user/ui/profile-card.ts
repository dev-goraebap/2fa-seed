import { DatePipe } from "@angular/common";
import { Component, input, InputSignal } from "@angular/core";
import { ProfileResultDTO } from "domain-shared/user";

@Component({
    selector: 'profile-card',
    imports: [
        DatePipe
    ],
    template: `
    @if (profile(); as profile) {
    <div>
        <div class="flex justify-start gap-4">
            <div class="rounded w-24 h-24 bg-blue-500"></div>
            <div>
                <div class="text-xl">{{profile.nickname}}</div>
                <div class="text-sm mt-1">{{profile.email}}</div>
                <div class="text-sm mt-1">가입일자: {{profile.createdAt|date:'yyyy-mm-dd'}}</div>
            </div>
        </div>
    </div>
    }
    `
})
export class ProfileCard {
    readonly profile: InputSignal<ProfileResultDTO | undefined> = input();
}