import { Component, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthResultDTO, AuthStatus } from "domain-shared/user";
import { Notyf } from "notyf";

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
        effect(() => {
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
        });

        effect(() => {
            const error: CustomError | null = this.loginState.error();
            if (error) {
                this.showPasswordFindButton = true;
                const notyf = new Notyf();
                notyf.error({
                    message: error.message,
                    dismissible: true
                });
            }
        });
    }
}