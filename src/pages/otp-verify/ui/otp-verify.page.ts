import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';

import { OtpRetryTimer } from 'src/features/send-otp';
import { CustomError } from 'src/shared/foundations';

import { OtpVerifyState } from '../states/otp-verify.state';
import { OtpVerifyForm } from './otp-verify-form/otp-verify.form';

@Component({
    selector: 'otp-verify-page',
    templateUrl: './otp-verify.page.html',
    imports: [
        OtpRetryTimer,
        OtpVerifyForm,
    ],
    providers: [
        OtpVerifyState,
    ],
})
export class OtpVerifyPage {

    readonly email: WritableSignal<string | null> = signal(null);

    private readonly router = inject(Router);
    private readonly otpVerifyState = inject(OtpVerifyState);

    constructor() {
        const state = this.router.getCurrentNavigation()?.extras.state;
        if (!state || !state['email']) {
            window.alert('잘못된 접근입니다.');
            this.router.navigateByUrl('/');
            return;
        }

        this.email.set(state['email']);

        effect(() => this.handleOtpVerifySuccess());
        effect(() => this.handleOtpVerifyError());
    }

    private handleOtpVerifySuccess() {
        const isCompleted: boolean = this.otpVerifyState.isCompleted();
        if (!isCompleted) return;

        this.router.navigateByUrl('/users/me');
    }

    private handleOtpVerifyError() {
        const error: CustomError | null = this.otpVerifyState.error();
        if (!error) return;

        new Notyf().error({
            message: error.message,
            dismissible: true,
        });
    }
}
