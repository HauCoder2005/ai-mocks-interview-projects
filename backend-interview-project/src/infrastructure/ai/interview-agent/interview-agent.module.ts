import { Module } from '@nestjs/common';
import { InterviewAgentService } from './interview-agent.service';

@Module({
  providers: [InterviewAgentService],
  exports: [InterviewAgentService],
})
export class InterviewAgentModule {}
