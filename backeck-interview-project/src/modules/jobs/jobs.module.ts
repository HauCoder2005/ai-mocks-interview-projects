import { Module } from '@nestjs/common';
import { JobsCleanupService } from './jobs-cleanup.service';
import { JobsCrawlerService } from './jobs-crawler.service';

/**
 * Module nền cho crawler việc làm và cleanup job hết hạn.
 */
@Module({
  providers: [JobsCrawlerService, JobsCleanupService],
})
export class JobsModule {}
