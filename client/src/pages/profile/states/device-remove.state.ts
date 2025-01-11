import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { RemoveOtherDeviceDTO } from "domain-shared/user";
import { catchError, EMPTY, finalize, Observable, switchMap, tap } from "rxjs";
import { DeviceApi } from "src/entities/user";
import { BaseState } from "src/shared/foundations";
import { DevicesState } from "./devices.state";

@Injectable()
export class DeviceRemoveState extends BaseState<void> {

    private readonly deviceApi: DeviceApi = inject(DeviceApi);
    private readonly devicesState: DevicesState = inject(DevicesState);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);

    readonly isCompleted: Signal<boolean> = this._isCompleted.asReadonly();

    remove(dto: RemoveOtherDeviceDTO): Observable<void> {
        this.setPending();

        return this.deviceApi.remove(dto).pipe(
            tap(() => this._isCompleted.set(true)),
            switchMap(() => this.devicesState.initialize()),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        );
    }
}