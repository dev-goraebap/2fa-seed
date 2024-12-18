import { Module } from "@nestjs/common";

import { UserRepository, UserTokenRepository } from "./infra/repositories";
import { AuthService, UserTokenService } from "./services";

@Module({
    imports: [],
    providers: [
        UserRepository,
        UserTokenRepository,
        UserTokenService,
        AuthService
    ],
    exports: [
        AuthService
    ]
})
export class UserModule {}