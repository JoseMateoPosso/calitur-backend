import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Guardia global de validación (DTOs)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  //Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('CaliTur API')
    .setDescription('Documentación oficial de la API para sitios turísticos de Cali')
    .setVersion('1.0')
    .addBearerAuth() // Le decimos que usamos Tokens VIP
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // La documentación vivirá en la ruta http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();