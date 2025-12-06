import { Module } from '@nestjs/common';
import { MongoModule } from './database/mongo.module';

@Module({
  imports: [MongoModule],
  exports: [MongoModule],
})
export class CoreModule {}
