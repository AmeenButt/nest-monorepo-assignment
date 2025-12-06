import { NestFactory } from '@nestjs/core';
import { AppModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('GATEWAY_PORT') ?? 3000;

  // uses class validator decorators on DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // strips unknown properties
      transform: true,         // converts types (e.g., strings to numbers)
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Gateway API')
    .setDescription('Public REST API for authentication')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // Swagger at /api

  await app.listen(port);
  console.log(`Gateway running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/swagger`);
}
bootstrap();
