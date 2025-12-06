import { ConfigModule } from '@app/config/config.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health/health.controller';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 20,
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule,
    AuthModule,
  ],
  controllers: [GatewayController, HealthController],
  providers: [GatewayService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
