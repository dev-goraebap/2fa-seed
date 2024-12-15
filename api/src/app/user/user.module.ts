import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity, UserTokenEntity } from "./infra/entities";
import { UserRepository } from "./infra/repositories";
import { UserTokenRepository } from "./infra/repositories/user-token.repository";
import { AuthService } from "./services";
import { UserTokenService } from "./services/user-token.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            UserTokenEntity
        ])
    ],
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