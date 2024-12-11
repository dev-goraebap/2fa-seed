import { Component, signal, WritableSignal } from "@angular/core";
import { delay, of, tap } from "rxjs";

import { LoginDTO, VerifyOtpDTO } from 'domain-shared/user';
import { LoginForm } from "src/features/user/login";
import { OtpVerifyForm } from "src/features/user/verify-otp";

@Component({
    selector: 'login-page',
    imports: [
        LoginForm,
        OtpVerifyForm
    ],
    template: `
    <div class="p-4">
        @if(!loginFormData()) {
            <login-form #loginForm (notify)="login($event)" />
        } @else {
            <otp-verify-form [loginFormData]="loginFormData()" (notify)="verifyOtp($event)" />
        }
    </div>
    `
})
export class LoginPage {

    protected readonly loginFormData: WritableSignal<LoginDTO | undefined> = signal(undefined);

    protected login(dto: LoginDTO) {
        console.log(dto);
        of(true).pipe(
            delay(1000),
            tap(() => {
                this.loginFormData.set(dto);
            })
        ).subscribe();
    }

    protected verifyOtp(dto: VerifyOtpDTO) {
        console.log(dto);
    }
}