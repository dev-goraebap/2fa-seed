import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "./infra/entities";
import { UserRepository } from "./infra/repositories";
import { AuthService } from "./services";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ])
    ],
    providers: [
        UserRepository,
        AuthService
    ],
    exports: [
        AuthService
    ]
})
export class UserModule {}