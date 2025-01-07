import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, Observable, tap } from "rxjs";

import { DeviceService } from "src/entities/user";
import { TokenStorage } from "src/shared/libs/jwt";
import { BaseState } from "src/shared/libs/base-state";

@Injectable()
export class LogoutState extends BaseState<void> {

    private readonly deviceService: DeviceService = inject(DeviceService);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);

    readonly isCompleted: Signal<boolean> = this._isCompleted.asReadonly();

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