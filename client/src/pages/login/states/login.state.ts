import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";

import { AuthResultDTO, LoginDTO } from "domain-shared/user";
import { AuthService } from "src/entities/user";
import { TokenStorage } from "src/shared/libs/jwt";
import { BaseState } from "src/shared/foundations";

@Injectable()
export class LoginState extends BaseState<AuthResultDTO> {

    private readonly authService: AuthService = inject(AuthService);
    private readonly _tempEmail: WritableSignal<string | null> = signal(null);

    readonly tempEmail: Signal<string | null> = this._tempEmail.asReadonly();

    login(loginDTO: LoginDTO): Observable<void> {
        this.setPending();
        this._tempEmail.set(loginDTO.email);

        return this.authService.login(loginDTO).pipe(
            delay(500),
            tap(data => this.setData(data)),
            tap(async (res: AuthResultDTO) => {
                const { accessToken, refreshToken, expiresIn } = res;
                if (accessToken && refreshToken && expiresIn) {
                    const tokenStorage = TokenStorage.getInstance()
                    await tokenStorage.store({
                        accessToken,
                        refreshToken,
                        expiresIn
                    });
                }
            }),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        );
    }

    resetTempEmail(): void {
        this._tempEmail.set(null);
    }
}