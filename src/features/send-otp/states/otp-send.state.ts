import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { AuthApi } from 'src/entities/auth';
import { BaseState } from 'src/shared/foundations';

@Injectable({
    providedIn: 'root',
})
export class OtpSendState extends BaseState<void> {

    readonly isCompleted: Signal<boolean>;

    private readonly authService = inject(AuthApi);
    private readonly _isCompleted = signal(false);

    constructor() {
        super();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    sendOtp(email: string) {
        this.setPending();

        return this.authService.sendOtp(email).pipe(
            tap(() => this._isCompleted.set(true)),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
