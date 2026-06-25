import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { AdminInterviewMasterDataController } from './admin/controllers/admin-interview-master-data.controller';
import { AdminInterviewPositionRepository } from './admin/repositories/admin-interview-position.repository';
import { AdminInterviewMasterDataService } from './admin/services/admin-interview-master-data.service';
import { CandidateInterviewOptionsService } from './candidate/services/candidate-interview-options.service';
import { CandidateInterviewPositionRepository } from './candidate/repositories/candidate-interview-position.repository';
import { CandidateInterviewOptionsController } from './candidate/controllers/candidate-interview-options.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminInterviewMasterDataController, CandidateInterviewOptionsController],
  providers: [
    AdminInterviewMasterDataService,
    AdminInterviewPositionRepository,
    CandidateInterviewOptionsService,
    CandidateInterviewPositionRepository
  ],
})
export class InterviewsModule {}