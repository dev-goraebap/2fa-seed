import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthResultDTO, LoginDTO } from "domain-shared/user";
import { environment } from "src/shared/environments";
import { skipAuth } from "src/shared/libs/jwt";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly apiUrl: string = `${environment.apiUrl}/v1/auth`;

    login(dto: LoginDTO): Observable<AuthResultDTO> {
        return this.httpClient.post<AuthResultDTO>(`${this.apiUrl}/login`, dto, {
            context: skipAuth()
        });
    }
}