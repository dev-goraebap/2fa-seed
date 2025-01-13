import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, Observable, tap } from "rxjs";

import { RegisterDTO } from "domain-shared/user";
import { AuthApi } from "src/entities/user";
import { BaseState } from "src/shared/foundations";

@Injectable()
export class RegisterState extends BaseState<void> {

    readonly tempEmail: Signal<string | null>;
    readonly isCompleted: Signal<boolean>;

    private readonly authService: AuthApi = inject(AuthApi);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);
    private readonly _tempEmail: WritableSignal<string | null> = signal(null);
    
    constructor() {
        super();
        this.tempEmail = this._tempEmail.asReadonly();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    register(dto: RegisterDTO): Observable<void> {
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