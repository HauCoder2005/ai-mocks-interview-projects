import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { StorageModule } from '../storage/storage.module';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

/**
 * Module core business cho mock interview.
 */
@Module({
  imports: [AiModule, StorageModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
