import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RegisterDTO } from "../dto";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly httpClient = inject(HttpClient);

    register(dto: RegisterDTO) {
        return this.httpClient.post('/api/auth/register', dto);
    }
}