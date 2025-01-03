import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { AuthResultDTO, CreateDeviceDTO } from "domain-shared/user";
import { Observable } from "rxjs";
import { environment } from "src/shared/environments";
import { skipAuth } from "src/shared/libs/jwt";

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly apiUrl: string = `${environment.apiUrl}/v1/devices`;

    createDevice(dto: CreateDeviceDTO): Observable<AuthResultDTO> {
        return this.httpClient.post<AuthResultDTO>(`${this.apiUrl}`, dto, {
            context: skipAuth()
        });
    }
}