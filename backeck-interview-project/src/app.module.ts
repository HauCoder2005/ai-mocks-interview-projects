import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import configuration from './config/configuration';
import { CacheModule } from './infrastructure/cache/cache.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CvReviewsModule } from './modules/cv-reviews/cv-reviews.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MailModule } from './modules/mail/mail.module';
import { winstonLoggerConfig } from './shared/logger/winston.config';

/**
 * Module gốc của ứng dụng.
 *
 * Module này chỉ đăng ký hạ tầng dùng chung và các feature module cấp cao.
 * Toàn bộ cấu hình runtime được nạp một lần qua ConfigModule để tránh nhiều
 * nguồn cấu hình song song.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    WinstonModule.forRoot(winstonLoggerConfig),
    ScheduleModule.forRoot(),
    CacheModule,
    PrismaModule,
    MailModule,
    AuthModule,
    CvReviewsModule,
    InterviewsModule,
    JobsModule,
  ],
})
export class AppModule {}
