import { Component, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Notyf } from "notyf";

import { AuthResultDTO, AuthStatus } from "domain-shared/user";
import { CustomError, DynamicDialogControl } from "src/shared/foundations";

import { LoginState } from "../states/login.state";
import { PasswordFindDialogUI } from "./find-password-dialog/password-find-dialog.ui";
import { LoginForm } from "./login-form/login.form";

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

    showPasswordFindButton: boolean = false;

    private readonly router: Router = inject(Router);
    private readonly ddc: DynamicDialogControl = inject(DynamicDialogControl);
    private readonly loginState: LoginState = inject(LoginState);

    constructor() {
        effect(() => this.handleLoginSuccess());
        effect(() => this.handleLoginError());
    }

    onOpenPasswordEditDialog(): void {
        this.ddc.open(PasswordFindDialogUI);
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

        // Easter Eggggggggggggggg :D
        this.showPasswordFindButton = true;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}