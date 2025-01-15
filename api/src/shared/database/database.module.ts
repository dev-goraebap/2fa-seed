import { createClient } from "@libsql/client";
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
                    type: 'sqlite',
                    driver: {
                      // Turso 커스텀 드라이버 설정
                      async create(): Promise<any> {
                        return createClient({
                          url: 'libsql://test-dev-goraebap.turso.io',
                          authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzY5MzQ0NzAsImlkIjoiMjk2NDM4NTYtMzE5OC00OGVjLWExZmEtNTgyMzY1MGE4NWZkIn0.WyMDTBp7pLzOsgruXqsNE8CVg1JtQXZH75WEkWN-9Tqc6MbCh_Qe0Vtp6VkhsTFNeV6ONL7X8Or-qaJZ3qdCAw',
                        });
                      },
                    },
                    entities: [/* your entities */],
                    synchronize: true, // 개발 환경에서만 true로 설정
                    autoLoadEntities: true,
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