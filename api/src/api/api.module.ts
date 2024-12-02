import { Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { AuthController } from "./controllers/auth.controller";

@Module({
    controllers: [
        AppController,
        AuthController
    ]
})
export class ApiModule {}