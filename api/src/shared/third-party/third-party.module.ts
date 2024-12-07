import { Global, Module } from "@nestjs/common";

import { MailService } from "./services";
import { OtpService } from "./services/otp.service";

@Global()
@Module({
    imports: [],
    providers: [
        MailService,
        OtpService
    ],
    exports: [
        MailService,
        OtpService
    ]
})
export class ThirdPartyModule {}