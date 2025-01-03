import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, Signal, viewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Notyf } from "notyf";
import { catchError, EMPTY, finalize } from "rxjs";

import { LoginDTO } from "domain-shared/user";
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

    private readonly authService: AuthService = inject(AuthService);
    private readonly loginFormEl: Signal<LoginForm> = viewChild.required('loginForm');

    protected onLogin(dto: LoginFormDTO) {
        const deviceId: string = Browser.getId();
        const loginDTO: LoginDTO = {
            ...dto,
            deviceId
        }
        this.authService.login(loginDTO).pipe(
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