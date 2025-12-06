import { NestFactory } from '@nestjs/core';
import { AppModule } from './authentication.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_TCP_PORT') ?? 4001;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
