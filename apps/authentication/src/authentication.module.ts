import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigModule } from '@app/config/config.module';
import { CoreModule } from '@app/core/core.module';
// import { CommonModule } from '@app/common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule, 
    CoreModule,   
    UsersModule, 
    AuthModule, 
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AppModule {}
