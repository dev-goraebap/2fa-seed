import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, delay, EMPTY, finalize, tap } from 'rxjs';

import { BaseState } from 'src/shared/foundations';
import { TokenStorage } from 'src/shared/libs/jwt';
import { AuthApi } from 'src/entities/auth';

@Injectable({
    providedIn: 'root',
})
export class LogoutState extends BaseState<void> {

    readonly isCompleted: Signal<boolean>;

    private readonly _isCompleted = signal(false);
    private readonly authApi = inject(AuthApi);

    constructor() {
        super();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    logout() {
        this.setPending();

        return this.authApi.logout().pipe(
            delay(500),
            tap(async () => {
                const tokenStorage = TokenStorage.getInstance();
                await tokenStorage.clearTokens();
            }),
            tap(() => this._isCompleted.set(true)),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
