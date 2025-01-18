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

        // 에러코드 VERIFY_EMAIL는 인증은 성공했지만,
        // 이메일 인증이 안된 상태로 OTP 인증 페이지로 이동시킵니다.
        if (error.signature === 'VERIFY_EMAIL') {
            const tempEmail = this.loginState.tempEmail();
            this.router.navigateByUrl('/verify-otp', {
                state: {
                    email: tempEmail
                }
            });
            return;
        }

        // Easter Eggggggggggggggg :D
        this.showPasswordFindButton = true;

        const notyf = new Notyf();
        notyf.error({
            message: error.message,
            dismissible: true
        });
    }
}
