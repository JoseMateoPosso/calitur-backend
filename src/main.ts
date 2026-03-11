// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activamos el "guardián" de validación para toda la aplicación
  // whitelist: true elimina cualquier dato extra o malicioso que envíen en el JSON
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.listen(3000);
}
bootstrap();