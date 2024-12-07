import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpService {
    async sendToEmail(email: string, otpCode: string) {
        throw new Error("Method not implemented.");
    }

    async sendToPhone(phoneNumber: string, otpCode: string) {
        throw new Error("Method not implemented.");
    }
}