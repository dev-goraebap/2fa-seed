import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, Observable, tap } from "rxjs";

import { RegisterDTO } from "domain-shared/user";
import { AuthService } from "src/entities/user";
import { BaseState } from "src/shared/services";

@Injectable()
export class RegisterState extends BaseState<void> {

    private readonly authService: AuthService = inject(AuthService);
    private readonly _isRegistered: WritableSignal<boolean> = signal(false);
    private readonly _tempEmail: WritableSignal<string | null> = signal(null);

    readonly tempEmail: Signal<string | null> = this._tempEmail.asReadonly();
    readonly isRegistered: Signal<boolean> = this._isRegistered.asReadonly();

    register(dto: RegisterDTO): Observable<void> {
        this.setPending();
        this._tempEmail.set(dto.email);

        return this.authService.register(dto).pipe(
            delay(500),
            tap(() => this._isRegistered.set(true)),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}