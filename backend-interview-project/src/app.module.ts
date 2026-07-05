import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration, configValidationSchema } from './config/env.config';
import { RedisModule } from './infrastructure/cache/redis/redis.module';
import { SpeechTranscriptionModule } from './infrastructure/ai/speech-transcription/speech-transcription.module';
import { MinioModule } from './infrastructure/storage/minio/minio.module';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { InterviewsModule } from './module/interviews/interviews.module';
import { QuestionBanksModule } from './module/question-banks/question-banks.module';
import { MockTestsModule } from './module/mock-tests/mock-tests.module';

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
    SpeechTranscriptionModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    InterviewsModule,
    QuestionBanksModule,
    MockTestsModule,
  ],
})
export class AppModule {}
