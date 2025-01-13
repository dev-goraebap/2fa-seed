import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";

import { AuthResultDTO, CreateDeviceDTO } from "domain-shared/user";
import { DeviceApi } from "src/entities/user";
import { BaseState } from "src/shared/foundations";
import { TokenStorage } from "src/shared/libs/jwt";

@Injectable()
export class OtpVerifyState extends BaseState<void> {

    readonly isCompleted: Signal<boolean>;

    private readonly deviceService: DeviceApi = inject(DeviceApi);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);

    constructor() {
        super();
        this.isCompleted = this._isCompleted.asReadonly();
    }

    verifyOtp(dto: CreateDeviceDTO): Observable<void> {
        this.setPending();

        return this.deviceService.createDevice(dto).pipe(
            delay(500),
            tap(() => this._isCompleted.set(true)),
            tap(async (res: AuthResultDTO) => {
                const { accessToken, refreshToken, expiresIn } = res;
                if (accessToken && refreshToken && expiresIn) {
                    const tokenStorage = TokenStorage.getInstance()
                    await tokenStorage.store({
                        accessToken,
                        refreshToken,
                        expiresIn
                    });
                }
            }),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        );
    }
}