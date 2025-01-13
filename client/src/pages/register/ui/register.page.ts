import { Component, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Notyf } from "notyf";

import { CustomError } from "src/shared/foundations";

import { RegisterState } from "../states/register.state";
import { RegisterForm } from "./register-form/register.form";

@Component({
    selector: 'register-page',
    templateUrl: './register.page.html',
    imports: [
        RegisterForm,
        RouterLink
    ],
    providers: [
        RegisterState
    ]
})
export class RegisterPage {

    private readonly router: Router = inject(Router);
    private readonly registerState: RegisterState = inject(RegisterState);

    constructor() {
        effect(() => this.handleRegisterSuccess());
        effect(() => this.handleRegisterError());
    }

    private handleRegisterSuccess(): void {
        const isRegistered: boolean = this.registerState.isCompleted();
        const tempEmail: string | null = this.registerState.tempEmail();

        // 회원가입이 완료되지 않았거나 임시 이메일이 없으면 처리하지 않음
        if (!isRegistered || !tempEmail) return;

        this.router.navigateByUrl('/verify-otp', {
            state: {
                email: tempEmail
            }
        });
    }

    private handleRegisterError(): void {
        const error: CustomError | null = this.registerState.error();
        if (!error) return;

        const notify = new Notyf();
        notify.error({
            message: error.message,
            dismissible: true
        });
    }
}