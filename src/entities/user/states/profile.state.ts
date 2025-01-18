import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, EMPTY, finalize, map, tap } from 'rxjs';

import { BaseState } from 'src/shared/foundations';

import { UserApi } from '../user.api';
import { ProfileResultDTO } from '../dto';

@Injectable({
    providedIn: 'root',
})
export class ProfileState extends BaseState<ProfileResultDTO> {

    private readonly userApi = inject(UserApi);

    initialize() {
        this.setPending();

        return this.userApi.getProfile().pipe(
            delay(500),
            tap((data: ProfileResultDTO) => this.setData(data)),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
