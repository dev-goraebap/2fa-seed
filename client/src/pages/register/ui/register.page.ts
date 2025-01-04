import { Component, effect, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Notyf } from "notyf";

import { RegisterForm, RegisterState } from "src/features/register";
import { CustomError } from "src/shared/services";

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
        effect(() => {
            const isRegistered: boolean = this.registerState.isRegistered();
            const tempEmail: string | null = this.registerState.tempEmail();
            if (isRegistered && tempEmail) {
                this.router.navigateByUrl('/verify-otp', {
                    state: {
                        email: tempEmail
                    }
                });
            }
        });

        effect(() => {
            const error: CustomError | null = this.registerState.error();
            if (error) {
                const notify = new Notyf();
                notify.error({
                    message: error.message,
                    dismissible: true
                });
            }
        });
    }
}