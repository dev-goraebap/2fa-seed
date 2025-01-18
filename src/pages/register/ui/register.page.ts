import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Notyf } from 'notyf';

import { RegisterState } from '../states/register.state';
import { RegisterForm } from './register-form/register.form';

@Component({
    selector: 'register-page',
    templateUrl: './register.page.html',
    imports: [
        RegisterForm,
        RouterLink,
    ],
    providers: [
        RegisterState,
    ],
})
export class RegisterPage {

    private readonly router = inject(Router);
    private readonly registerState = inject(RegisterState);

    constructor() {
        effect(() => this.handleRegisterSuccess());
        effect(() => this.handleRegisterError());
    }

    private handleRegisterSuccess() {
        const isRegistered = this.registerState.isCompleted();
        const tempEmail = this.registerState.tempEmail();

        // 회원가입이 완료되지 않았거나 임시 이메일이 없으면 처리하지 않음
        if (!isRegistered || !tempEmail) return;

        this.router.navigateByUrl('/verify-otp', {
            state: {
                email: tempEmail,
            },
        });
    }

    private handleRegisterError() {
        const error = this.registerState.error();
        if (!error) return;

        const notify = new Notyf();
        notify.error({
            message: error.message,
            dismissible: true,
        });
    }
}
