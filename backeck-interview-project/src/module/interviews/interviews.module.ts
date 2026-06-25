import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { AdminInterviewMasterDataController } from './admin/controllers/admin-interview-master-data.controller';
import { AdminInterviewPositionRepository } from './admin/repositories/admin-interview-position.repository';
import { AdminInterviewMasterDataService } from './admin/services/admin-interview-master-data.service';
import { CandidateInterviewOptionsService } from './candidate/services/candidate-interview-options.service';
import { CandidateInterviewPositionRepository } from './candidate/repositories/candidate-interview-position.repository';
import { CandidateInterviewOptionsController } from './candidate/controllers/candidate-interview-options.controller';
import { AdminInterviewLevelController } from './admin/controllers/admin-interview-level.controller';
import { AdminInterviewLevelRepository } from './admin/repositories/admin-interview-level.repository';
import { AdminInterviewLevelService } from './admin/services/admin-interview-level.service';
import { CandidateInterviewLevelRepository } from './candidate/repositories/candidate-interview-level.repository';
import { CandidateInterviewLevelService } from './candidate/services/candidate-interview-level.service';
import { AdminInterviewTechnologyController } from './admin/controllers/admin-interview-technology.controller';
import { AdminInterviewTechnologyRepository } from './admin/repositories/admin-interview-technology.repository';
import { AdminInterviewTechnologyService } from './admin/services/admin-interview-technology.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminInterviewMasterDataController, AdminInterviewLevelController, AdminInterviewTechnologyController, CandidateInterviewOptionsController],
  providers: [
    AdminInterviewMasterDataService,
    AdminInterviewPositionRepository,
    AdminInterviewLevelRepository,
    AdminInterviewLevelService,
    AdminInterviewTechnologyRepository,
    AdminInterviewTechnologyService,
    CandidateInterviewOptionsService,
    CandidateInterviewPositionRepository,
    CandidateInterviewLevelRepository,
    CandidateInterviewLevelService,
  ],
})
export class InterviewsModule {}