import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PlatformRef, signal, WritableSignal } from "@angular/core";
import { filter, interval, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    private readonly platformId: PlatformRef = inject(PlatformRef);
    private readonly _accessToken: WritableSignal<string | undefined> = signal(undefined);
    private readonly _refreshToken: WritableSignal<string | undefined> = signal(undefined);
    private readonly refreshInterval$ = interval(1000 * 60);

    readonly accessToken = this._accessToken.asReadonly();
    readonly refreshToken = this._refreshToken.asReadonly();

    constructor() {

    }

    refreshInterval() {
        return this.refreshInterval$.pipe(
            filter(() => this._accessToken() !== undefined),
            map(() => {
                console.log(this._accessToken());
            })
        );
    }

    setAccessToken(accessToken: string) {
        this._accessToken.set(accessToken);
    }

    setRefreshToken(refreshToken: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        localStorage.setItem('refreshToken', refreshToken);
    }
}