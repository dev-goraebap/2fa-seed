import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";

import { UserModule } from "src/app/user";

import { AppController, AuthController, DeviceAccessController, SocialController, UserController } from "./controllers";
import { GlobalExceptionFilter } from "./errors";
import { AuthGuard } from "./guards";

@Module({
    imports: [
        UserModule
    ],
    controllers: [
        AppController,
        AuthController,
        SocialController,
        DeviceAccessController,
        UserController,
    ],
    providers: [
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_GUARD, useClass: AuthGuard },
    ],
})
export class ApiModule { }