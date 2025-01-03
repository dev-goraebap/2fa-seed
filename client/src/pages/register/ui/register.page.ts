import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, Signal, viewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RegisterDTO } from "domain-shared/user";
import { Notyf } from "notyf";
import { catchError, EMPTY, finalize } from "rxjs";

import { AuthService } from "src/entities/user";
import { RegisterForm } from "src/features/register";

@Component({
    selector: 'register-page',
    templateUrl: './register.page.html',
    imports: [
        RegisterForm,
        RouterLink
    ],
})
export class RegisterPage {

    private readonly authService: AuthService = inject(AuthService);
    private readonly registerFormEl: Signal<RegisterForm> = viewChild.required('registerForm');

    protected onRegister(dto: RegisterDTO) {
        this.authService.register(dto).pipe(
            catchError((res: HttpErrorResponse) => {
                const notify = new Notyf();
                notify.error({
                    message: res.error.message,
                    dismissible: true
                });
                return EMPTY;
            }),
            finalize(() => this.registerFormEl().changeToFetched()),
        ).subscribe();
    }
}