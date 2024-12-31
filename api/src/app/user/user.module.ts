import { Module } from "@nestjs/common";

import { UserSessionRepository } from "./infra/repositories/user-session.repository";
import { UserRepository } from "./infra/repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { UserSessionService } from "./services/user-session.service";
import { UserService } from "./services/user.service";

@Module({
    imports: [],
    providers: [
        UserRepository,
        UserSessionRepository,
        AuthService,
        UserService,
        UserSessionService,
    ],
    exports: [
        AuthService,
        UserService,
        UserSessionService,
    ]
})
export class UserModule {}