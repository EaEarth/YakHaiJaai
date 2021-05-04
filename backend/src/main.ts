import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import admin from 'firebase-admin';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   cors: {
  //     origin: ['http://localhost:3000'],
  //     credentials: true,
  //   },
  // });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID.replace(/\\n/g, '\n'),
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL.replace(/\\n/g, '\n'),
    }),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  await app.listen(8000);
}
bootstrap();
