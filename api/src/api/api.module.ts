import { Module } from "@nestjs/common";

import { UserModule } from "src/app/user";
import { AppController } from "./controllers/app.controller";
import { AuthController } from "./controllers/auth.controller";

@Module({
    imports: [
        UserModule
    ],
    controllers: [
        AppController,
        AuthController
    ],
})
export class ApiModule {}