import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { delay, Observable, of, tap } from "rxjs";

import { ProfileResultDTO } from "domain-shared/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly _isFetched: WritableSignal<boolean> = signal(false);
    private readonly _data: WritableSignal<ProfileResultDTO | undefined> = signal(undefined);

    readonly isFetched: Signal<boolean> = this._isFetched.asReadonly();
    readonly data: Signal<ProfileResultDTO | undefined> = this._data.asReadonly();

    initProfile(): Observable<ProfileResultDTO> {
        return of({
            id: '1',
            nickname: 'test',
            email: 'test@test.com',
            createdAt: new Date()
        }).pipe(
            delay(1000),
            tap(profile => {
                console.log(profile);
                const probability = Math.random();
                if (probability < 0.5) {
                    throw new Error('프로필 조회에 실패하였어요.');
                }
                this._data.set(profile);
                this._isFetched.set(true);
            }),
        );
    }
}