import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, Observable, tap } from "rxjs";

import { DeviceApi } from "src/entities/user";
import { BaseState } from "src/shared/foundations";
import { TokenStorage } from "src/shared/libs/jwt";

@Injectable({
    providedIn: 'root'
})
export class LogoutState extends BaseState<void> {

    readonly isCompleted: Signal<boolean>;

    private readonly deviceService: DeviceApi = inject(DeviceApi);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);

    constructor() {
        super();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    logout(): Observable<void> {
        this.setPending();

        return this.deviceService.logout().pipe(
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
            finalize(() => this.clearPending())
        )
    }
}