import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { delay, of, tap } from "rxjs";
import { RegisterDTO } from "../dto";

export type CommonState = {
    isFetching: boolean;
    error: string | null;
    data: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient = inject(HttpClient);
    private readonly state = signal<CommonState>({
        isFetching: false,
        error: null,
        data: null,
    });

    register(dto: RegisterDTO) {
        this.state.update(state => ({
            ...state,
            isFetching: true,
        }));

        return of().pipe(
            delay(1000),
            tap(() => {
                this.state.update(state => ({
                    ...state,
                    isFetching: false,
                }));
            })
        );
    }
}