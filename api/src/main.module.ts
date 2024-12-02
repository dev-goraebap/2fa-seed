import { Module } from "@nestjs/common";
import { ApiModule } from "./api";
import { ConfigModule } from "./shared/config";
import { DatabaseModule } from "./shared/database";

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        ApiModule
    ],
})
export class MainModule {}