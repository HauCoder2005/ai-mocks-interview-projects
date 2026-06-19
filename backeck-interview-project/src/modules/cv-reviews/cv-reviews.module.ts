import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { CvReviewsController } from './cv-reviews.controller';
import { CvReviewsService } from './cv-reviews.service';

/**
 * Module upload và chấm điểm CV bằng AI.
 */
@Module({
  imports: [StorageModule],
  controllers: [CvReviewsController],
  providers: [CvReviewsService],
})
export class CvReviewsModule {}
