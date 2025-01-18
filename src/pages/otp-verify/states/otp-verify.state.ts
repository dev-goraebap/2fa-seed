import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, delay, EMPTY, finalize, map, tap } from 'rxjs';

import { AuthApi, AuthResultDTO, VerifyOtpDTO } from 'src/entities/auth';
import { BaseState } from 'src/shared/foundations';
import { TokenStorage } from 'src/shared/libs/jwt';

@Injectable()
export class OtpVerifyState extends BaseState<void> {

    readonly isCompleted: Signal<boolean>;

    private readonly authApi = inject(AuthApi);
    private readonly _isCompleted = signal(false);

    constructor() {
        super();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    verifyOtp(dto: VerifyOtpDTO) {
        this.setPending();

        return this.authApi.verifyOtp(dto).pipe(
            tap(() => this._isCompleted.set(true)),
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
