import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  configuration,
  configValidationSchema,
} from './config/env.config';
import { RedisModule } from './infrastructure/cache/redis/redis.module';
import { MinioModule } from './infrastructure/storage/minio/minio.module';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    RedisModule,
    MinioModule,
    PrismaModule,
  ],
})
export class AppModule {}