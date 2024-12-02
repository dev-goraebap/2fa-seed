import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            envFilePath: '.env.' + process.env.NODE_ENV,
        })
    ],
    exports: [
        NestConfigModule
    ]
})
export class ConfigModule {
    constructor() {
        console.log('환경변수 실행환경:', process.env.NODE_ENV);
    }
}