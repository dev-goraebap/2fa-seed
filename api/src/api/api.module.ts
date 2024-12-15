import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { UserModule } from "src/app/user";

import { AppController } from "./controllers/app.controller";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";
import { AuthGuard } from "./guards";

@Module({
    imports: [
        UserModule
    ],
    controllers: [
        AppController,
        AuthController,
        UserController
    ],
    providers: [
        { provide: APP_GUARD, useClass: AuthGuard }
    ],
})
export class ApiModule { }