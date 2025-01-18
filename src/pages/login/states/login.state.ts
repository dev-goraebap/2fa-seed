import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from 'rxjs';

import { AuthApi, AuthResultDTO, LoginDTO } from 'src/entities/auth';
import { TokenStorage } from 'src/shared/libs/jwt';
import { BaseState } from 'src/shared/foundations';

@Injectable()
export class LoginState extends BaseState<AuthResultDTO> {

    private readonly authService = inject(AuthApi);
    private readonly _tempEmail = signal<string | null>(null);

    readonly tempEmail = this._tempEmail.asReadonly();

    login(loginDTO: LoginDTO): Observable<void> {
        this.setPending();
        this._tempEmail.set(loginDTO.email);

        return this.authService.login(loginDTO).pipe(
            delay(500),
            tap(data => this.setData(data)),
            tap(async (res: AuthResultDTO) => {
                const { accessToken, refreshToken, expiresIn } = res;
                const tokenStorage = TokenStorage.getInstance();
                await tokenStorage.store({
                    accessToken,
                    refreshToken,
                    expiresIn,
                });
            }),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
