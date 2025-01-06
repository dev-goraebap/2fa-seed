import { Component, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Notyf } from "notyf";

import { AuthResultDTO, AuthStatus } from "domain-shared/user";
import { LoginForm, LoginState } from "src/features/login";
import { CustomError } from "src/shared/services";

@Component({
    selector: 'login-page',
    templateUrl: './login.page.html',
    imports: [
        LoginForm,
        RouterLink
    ],
    providers: [
        LoginState
    ]
})
export class LoginPage {

    private readonly router: Router = inject(Router);
    private readonly loginState: LoginState = inject(LoginState);

    protected showPasswordFindButton: boolean = false;

    constructor() {
        effect(() => this.handleLoginSuccess());
        effect(() => this.handleLoginError());
    }

    private handleLoginSuccess(): void {
        const data: AuthResultDTO | null = this.loginState.data();
        const tempEmail: string | null = this.loginState.tempEmail();

        if (data?.status === AuthStatus.SUCCESS) {
            this.router.navigateByUrl('/users/me');
        } else if (data?.status === AuthStatus.NEED_OTP && tempEmail) {
            this.router.navigateByUrl('/verify-otp', {
                state: {
                    email: tempEmail
                }
            });
        }
    }

    private handleLoginError() {
        const error: CustomError | null = this.loginState.error();
        if (!error) return;

        this.showPasswordFindButton = true;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}