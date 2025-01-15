import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";

import { UserSessionModule } from "src/app/user-session";

import { UserModule } from "src/app/userv2";
import { AppController, AuthController, UserController } from "./controllers";
import { GlobalExceptionFilter } from "./errors";
import { AuthGuard } from "./guards";

@Module({
    imports: [
        UserModule,
        UserSessionModule
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
    ],
    providers: [
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_GUARD, useClass: AuthGuard },
    ],
})
export class ApiModule { }