import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";

import { ProfileResultDTO } from "domain-shared/user";
import { UserService } from "src/entities/user";
import { BaseState } from "src/shared/libs/base-state";

@Injectable()
export class NicknameEditState extends BaseState<ProfileResultDTO> {

    private readonly userService: UserService = inject(UserService);

    updateNickname(nickname: string): Observable<void> {
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
            finalize(() => this.clearPending())
        );
    }
}