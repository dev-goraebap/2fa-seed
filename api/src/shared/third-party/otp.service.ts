import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpService {
    async send(phoneNumber: string, otpCode: string) {
        throw new Error("Method not implemented.");
    }
}