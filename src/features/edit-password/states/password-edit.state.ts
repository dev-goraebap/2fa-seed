import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { UpdatePasswordDTO, UserApi } from 'src/entities/user';
import { BaseState } from 'src/shared/foundations';

@Injectable({
    providedIn: 'root',
})
export class PasswordEditState extends BaseState<void> {

    readonly isCompleted: Signal<boolean>;

    private readonly userApi = inject(UserApi);
    private readonly _isCompleted = signal(false);

    constructor() {
        super();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    editPassword(dto: UpdatePasswordDTO) {
        this.setPending();

        return this.userApi.updatePassword(dto).pipe(
            tap(() => this._isCompleted.set(true)),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
