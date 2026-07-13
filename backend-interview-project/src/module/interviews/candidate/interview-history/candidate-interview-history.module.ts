import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import SecurityModule from 'src/shared/security/security.module';
import { CandidateInterviewHistoryController } from './controllers/candidate-interview-history.controller';
import { CandidateInterviewHistoryRepository } from './repositories/candidate-interview-history.repository';
import { CandidateInterviewHistoryService } from './services/candidate-interview-history.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [CandidateInterviewHistoryController],
  providers: [
    CandidateInterviewHistoryService,
    CandidateInterviewHistoryRepository,
  ],
})
export class CandidateInterviewHistoryModule {}
