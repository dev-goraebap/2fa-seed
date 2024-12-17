import { Module } from "@nestjs/common";

import { UserRepository } from "./infra/repositories";
import { UserTokenRepository } from "./infra/repositories/user-token.repository";
import { AuthService } from "./services";
import { UserTokenService } from "./services/user-token.service";

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