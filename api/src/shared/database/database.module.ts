import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EnvConfig } from "../config";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService<EnvConfig>) => {
                return {
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    database: configService.get('DB_NAME'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    logging: configService.get('DB_LOGGING') === 'true' ? true : false,
                    autoLoadEntities: true,
                    synchronize: true,
                    namingStrategy: new SnakeNamingStrategy()
                }
            },
            inject: [ConfigService]
        })
    ],
})
export class DatabaseModule {
    constructor() {
        console.log('DB 모듈 구동');
    }
}