import { Global, Module } from "@nestjs/common";

import { FirebaseService } from "./services/firebase.service";
import { GoogleService } from "./services/google.service";
import { KakaoService } from "./services/kakao.service";
import { MailService } from "./services/mail.service";

@Global()
@Module({
    providers: [
        FirebaseService,
        MailService,
        KakaoService,
        GoogleService,
    ],
    exports: [
        FirebaseService,
        MailService,
        KakaoService,
        GoogleService
    ]
})
export class ThirdPartyModule {}