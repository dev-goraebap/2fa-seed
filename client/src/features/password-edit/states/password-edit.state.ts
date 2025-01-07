import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, Observable, tap } from "rxjs";

import { UpdatePasswordDTO } from "domain-shared/user";
import { UserService } from "src/entities/user";
import { BaseState } from "src/shared/libs/base-state";

@Injectable()
export class PasswordEditState extends BaseState<void> {

    private readonly userService: UserService = inject(UserService);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);

    readonly isCompleted: Signal<boolean> = this._isCompleted.asReadonly();

    updatePassword(dto: UpdatePasswordDTO): Observable<void> {
        this.setPending();
        return this.userService.updatePassword(dto).pipe(
            delay(500),
            tap(_ => this._isCompleted.set(true)),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        );
    }
}