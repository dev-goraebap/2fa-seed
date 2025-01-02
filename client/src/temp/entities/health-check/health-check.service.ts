import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { skipAuth } from "src/shared/libs/jwt";

@Injectable({
    providedIn: 'root'
})
export class HealthCheckService {

    private readonly httpClient: HttpClient = inject(HttpClient);

    healthCheck() {
        return this.httpClient.get<void>('http://localhost:8000/api/healthy', {
            context: skipAuth()
        });
    }
}