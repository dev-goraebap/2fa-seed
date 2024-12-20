import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { finalize, Observable, tap } from "rxjs";

import { ProfileResultDTO } from "domain-shared/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly _isFetched: WritableSignal<boolean> = signal(false);
    private readonly _data: WritableSignal<ProfileResultDTO | undefined> = signal(undefined);

    readonly isFetched: Signal<boolean> = this._isFetched.asReadonly();
    readonly data: Signal<ProfileResultDTO | undefined> = this._data.asReadonly();

    initProfile(): Observable<ProfileResultDTO> {
        return this.httpClient.get<ProfileResultDTO>('http://localhost:8000/api/v1/users/me').pipe(
            tap(res => {
                console.log(res)
            }),
            finalize(() => this._isFetched.set(true))
        );
    }
}