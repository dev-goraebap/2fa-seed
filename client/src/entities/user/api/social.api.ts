import { Injectable } from "@angular/core";
import { environment } from "src/shared/environments";

@Injectable({
    providedIn: 'root'
})
export class SocialApi {

    private readonly apiUrl: string = `${environment.apiUrl}/v1/socials`;

    getKakaoLoginUrl(): string {
        return `${this.apiUrl}/kakao/login`;
    }
}