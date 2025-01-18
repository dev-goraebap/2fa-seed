import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, EMPTY, finalize, map, tap } from 'rxjs';

import { ProfileResultDTO, UserApi } from 'src/entities/user';
import { BaseState } from 'src/shared/foundations';

@Injectable({
    providedIn: 'root',
})
export class NicknameEditState extends BaseState<ProfileResultDTO> {

    private readonly userService = inject(UserApi);

    updateNickname(nickname: string) {
        this.setPending();

        return this.userService.updateNickname(nickname).pipe(
            delay(500),
            tap((data: ProfileResultDTO) => {
                this.setData(data);
            }),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending()),
        );
    }
}
