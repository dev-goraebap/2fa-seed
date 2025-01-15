import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { join } from 'path';
import { validationExceptionFactory } from './api';
import { MainModule } from './main.module';
import { EnvConfig } from './shared/config';

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// const turso = createClient({
//   url: 'libsql://test-dev-goraebap.turso.io',
//   authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzY5MzQ0NzAsImlkIjoiMjk2NDM4NTYtMzE5OC00OGVjLWExZmEtNTgyMzY1MGE4NWZkIn0.WyMDTBp7pLzOsgruXqsNE8CVg1JtQXZH75WEkWN-9Tqc6MbCh_Qe0Vtp6VkhsTFNeV6ONL7X8Or-qaJZ3qdCAw',
// });
//
// export const drizzle = drizzle(turso);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  // cors 설정
  app.enableCors({
    origin: [
      'https://jwt-auth-seed-926d8.web.app', // 웹 배포 환경
      'http://localhost:4200',  // 웹 개발 환경
      'http://localhost:56979',  // 웹 개발 환경
      'capacitor://localhost',  // Capacitor
      'ionic://localhost',      // Ionic
      'file://*'               // 안드로이드 WebView
    ]
  });

  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '../../..', 'public'));

  // 전역 접두사 설정
  app.setGlobalPrefix('api');
  app.enableVersioning();

  // 전역 파이프 설정
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => validationExceptionFactory(errors)
  }));

  // 환경변수 초기화
  const configService = app.get(ConfigService<EnvConfig>);
  const port = configService.get('APP_PORT');

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('JWT AUTH SEED API')
    .setDescription('JWT Authentication Seed API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port ?? 8000);
}
bootstrap();
