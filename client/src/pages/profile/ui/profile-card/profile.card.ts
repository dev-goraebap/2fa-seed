import { DatePipe } from "@angular/common";
import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { ProfileResultDTO } from "domain-shared/user";

@Component({
    selector: 'profile-card',
    templateUrl: './profile.card.html',
    imports: [
        DatePipe
    ]
})
export class ProfileCard {

    readonly profile: InputSignal<ProfileResultDTO | null> = input.required();
    readonly onEditNavigate: OutputEmitterRef<'nickname' | 'email' | 'password'> = output();

    protected onClick(type: 'nickname' | 'email' | 'password') {
        this.onEditNavigate.emit(type);
    }
}