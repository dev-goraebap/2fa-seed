import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";

import { AuthResultDTO, CreateDeviceDTO } from "domain-shared/user";
import { DeviceService } from "src/entities/user";
import { TokenStorage } from "src/shared/libs/jwt";
import { BaseState } from "src/shared/services";

@Injectable()
export class OtpVerifyState extends BaseState<void> {

    private readonly deviceService: DeviceService = inject(DeviceService);
    private readonly _isCompleted: WritableSignal<boolean> = signal(false);

    readonly isCompleted: Signal<boolean> = this._isCompleted.asReadonly();

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