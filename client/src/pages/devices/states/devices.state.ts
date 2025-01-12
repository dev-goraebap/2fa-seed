import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { DeviceResultDTO } from "domain-shared/user";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";
import { DeviceApi } from "src/entities/user";
import { BaseItemsState } from "src/shared/foundations";

@Injectable({
    providedIn: 'root'
})
export class DevicesState extends BaseItemsState<DeviceResultDTO> {

    private readonly deviceApi: DeviceApi = inject(DeviceApi);

    initialize(): Observable<void> {
        this.setPending();

        return this.deviceApi.getDevices().pipe(
            delay(500),
            tap((data: DeviceResultDTO[]) => console.log(data)),
            tap((data: DeviceResultDTO[]) => this.setData(data)),
            map(_ => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        );
    }
}