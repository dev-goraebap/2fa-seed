import { Module } from "@nestjs/common";

import { UserSessionRepository } from "./infra/repositories/user-session.repository";
import { UserSocialRepository } from "./infra/repositories/user-social.repository";
import { UserRepository } from "./infra/repositories/user.repository";
import { LocalAuthService } from "./services/local-auth.service";
import { UserSessionService } from "./services/user-session.service";
import { UserService } from "./services/user.service";
import { SocialAuthService } from "./services/social-auth.service";

@Module({
    imports: [],
    providers: [
        UserRepository,
        UserSessionRepository,
        UserSocialRepository,
        LocalAuthService,
        SocialAuthService,
        UserService,
        UserSessionService,
    ],
    exports: [
        LocalAuthService,
        SocialAuthService,
        UserService,
        UserSessionService,
    ]
})
export class UserModule {}