import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, Signal, viewChild } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Notyf } from "notyf";
import { catchError, EMPTY, finalize, tap } from "rxjs";

import { AuthStatus, LoginDTO } from "domain-shared/user";
import { AuthService } from "src/entities/user";
import { LoginForm, LoginFormDTO } from "src/features/login";
import { Browser } from "src/shared/libs/browser";

@Component({
    selector: 'login-page',
    templateUrl: './login.page.html',
    imports: [
        LoginForm,
        RouterLink
    ]
})
export class LoginPage {

    protected showPasswordFindButton: boolean = false;

    private readonly router: Router = inject(Router);
    private readonly loginFormEl: Signal<LoginForm> = viewChild.required('loginForm');
    private readonly authService: AuthService = inject(AuthService);

    protected onLogin(dto: LoginFormDTO): void {
        const deviceId: string = Browser.getId();
        const loginDTO: LoginDTO = {
            ...dto,
            deviceId
        }
        this.authService.login(loginDTO).pipe(
            tap(res => {
                if (res.status === AuthStatus.NEED_OTP) {
                    this.router.navigateByUrl('/verify-otp', {
                        state: {
                            email: dto.email
                        }
                    });
                } else {
                    this.router.navigateByUrl('/users/me');
                }
            }),
            catchError((res: HttpErrorResponse) => {
                // Easter egg 🐣
                this.showPasswordFindButton = true;

                const notify = new Notyf();
                notify.error({
                    message: res.error.message,
                    dismissible: true
                });
                return EMPTY;
            }),
            finalize(() => this.loginFormEl().changeToFetched()),
        ).subscribe();
    }
}