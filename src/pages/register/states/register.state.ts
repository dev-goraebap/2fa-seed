import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, delay, EMPTY, finalize, tap } from 'rxjs';

import { BaseState } from 'src/shared/foundations';
import { AuthApi, RegisterDTO } from 'src/entities/auth';

@Injectable()
export class RegisterState extends BaseState<void> {

    readonly tempEmail: Signal<string | null>;
    readonly isCompleted: Signal<boolean>;

    private readonly authService = inject(AuthApi);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);
    private readonly _tempEmail: WritableSignal<string | null> = signal(null);

    constructor() {
        super();
        this.tempEmail = this._tempEmail.asReadonly();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    register(dto: RegisterDTO) {
        this.setPending();
        this._tempEmail.set(dto.email);

        return this.authService.register(dto).pipe(
            delay(500),
            tap(() => this._isCompleted.set(true)),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
