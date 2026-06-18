import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

/**
 * Module đóng gói các tác vụ AI của ứng dụng.
 */
@Module({
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
