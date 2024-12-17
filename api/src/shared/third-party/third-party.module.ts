import { Global, Module } from "@nestjs/common";

import { FirebaseModule } from "./firebase";
import { MailService } from "./services";
import { OtpService } from "./services/otp.service";

@Global()
@Module({
    imports: [
        FirebaseModule
    ],
    providers: [
        MailService,
        OtpService
    ],
    exports: [
        FirebaseModule,
        MailService,
        OtpService
    ]
})
export class ThirdPartyModule {}