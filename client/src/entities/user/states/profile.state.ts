import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, delay, EMPTY, finalize, map, Observable, tap } from "rxjs";

import { ProfileResultDTO } from "domain-shared/user";

import { BaseState } from "src/shared/foundations";
import { UserService } from "../services/user.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileState extends BaseState<ProfileResultDTO> {

    private readonly userService: UserService = inject(UserService);

    initialize(): Observable<void> {
        this.setPending();

        return this.userService.getProfile().pipe(
            delay(500),
            tap((data: ProfileResultDTO) => this.setData(data)),
            map(() => void 0),
            catchError((res: HttpErrorResponse) => {
                this.setError(res.error);
                return EMPTY;
            }),
            finalize(() => this.clearPending())
        )
    }
}