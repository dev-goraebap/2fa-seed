import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";

import { ProfileResultDTO } from "domain-shared/user";

import { BaseState } from "src/shared/foundations";
import { UserApi } from "../api/user.api";

@Injectable({
    providedIn: 'root'
})
export class ProfileState extends BaseState<ProfileResultDTO> {

    private readonly userApi: UserApi = inject(UserApi);

    initialize(): Observable<void> {
        this.setPending();

        return this.userApi.getProfile().pipe(
            delay(2000),
            tap((data: ProfileResultDTO) => this.setData(data)),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        );
    }
}