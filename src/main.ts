import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Lazuno Ok')
    .setDescription('The Lazuno OK API description')
    .setVersion('1.0')
    .addServer('https://srvr.lazuno.uz')
    .addServer('http://localhost:3000')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
