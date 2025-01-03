import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, Signal, viewChild } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { RegisterDTO } from "domain-shared/user";
import { Notyf } from "notyf";
import { catchError, EMPTY, finalize, tap } from "rxjs";

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

    private readonly router: Router = inject(Router);
    private readonly registerFormEl: Signal<RegisterForm> = viewChild.required('registerForm');
    private readonly authService: AuthService = inject(AuthService);

    protected onRegister(dto: RegisterDTO) {
        this.authService.register(dto).pipe(
            tap(() => {
                this.router.navigateByUrl('/verify-otp', {
                    state: {
                        email: dto.email
                    }
                });
            }),
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