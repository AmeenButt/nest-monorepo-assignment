import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NetworkingService } from './networking/networking.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_MICROSERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_MICROSERVICE_HOST') ?? '127.0.0.1',
            port: configService.get<number>('AUTH_TCP_PORT') ?? 4001,
          },
        }),
      },
    ]),
  ],
  providers: [NetworkingService],
  exports: [NetworkingService],
})
export class CommonModule {}
