import { Component, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Notyf } from "notyf";

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

    private readonly router = inject(Router);
    private readonly ddc = inject(DynamicDialogControl);
    private readonly loginState = inject(LoginState);

    constructor() {
        effect(() => this.handleLoginSuccess());
        effect(() => this.handleLoginError());
    }

    onOpenPasswordEditDialog() {
        this.ddc.open(PasswordFindDialogUI);
    }

    private async handleLoginSuccess() {
        const data = this.loginState.data();
        if (!data) return;
        await this.router.navigateByUrl('/users/me');
    }

    private handleLoginError() {
        const error: CustomError | null = this.loginState.error();
        if (!error) return;
        // const tempEmail = this.loginState.tempEmail();
        // this.router.navigateByUrl('/verify-otp', {
        //     state: {
        //         email: tempEmail
        //     }
        // });

        // Easter Eggggggggggggggg :D
        this.showPasswordFindButton = true;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}
