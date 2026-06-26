import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import SecurityModule from 'src/shared/security/security.module';
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
import { CandidateInterviewTechnologyService } from './candidate/services/candidate-interview-technology.service';
import { CandidateInterviewTechnologyRepository } from './candidate/repositories/candidate-interview-technology.repository';
import { CandidateInterviewTechnologyController } from './candidate/controllers/candidate-interview-technology.controller';
import { AdminInterviewTopicController } from './admin/controllers/admin-interview-topic.controller';
import { AdminInterviewTopicRepository } from './admin/repositories/admin-interview-topic.repository';
import { AdminInterviewTopicService } from './admin/services/admin-interview-topic.service';
import { CandidateInterviewTopicController } from './candidate/controllers/candidate-interview-topic.controller';
import { CandidateInterviewTopicRepository } from './candidate/repositories/candidate-interview-topic.repository';
import { CandidateInterviewTopicService } from './candidate/services/candidate-interview-topic.service';
import { CandidateInterviewConfigurationController } from './candidate/controllers/candidate-interview-configuration.controller';
import { CandidateInterviewConfigurationRepository } from './candidate/repositories/candidate-interview-configuration.repository';
import { CandidateInterviewConfigurationService } from './candidate/services/candidate-interview-configuration.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [
    AdminInterviewMasterDataController,
    AdminInterviewLevelController,
    AdminInterviewTechnologyController,
    AdminInterviewTopicController,
    CandidateInterviewOptionsController,
    CandidateInterviewTechnologyController,
    CandidateInterviewTopicController,
    CandidateInterviewConfigurationController,
  ],
  providers: [
    AdminInterviewMasterDataService,
    AdminInterviewPositionRepository,
    AdminInterviewLevelRepository,
    AdminInterviewLevelService,
    AdminInterviewTechnologyRepository,
    AdminInterviewTechnologyService,
    AdminInterviewTopicRepository,
    AdminInterviewTopicService,
    CandidateInterviewOptionsService,
    CandidateInterviewPositionRepository,
    CandidateInterviewLevelRepository,
    CandidateInterviewLevelService,
    CandidateInterviewTechnologyService,
    CandidateInterviewTechnologyRepository,
    CandidateInterviewTopicService,
    CandidateInterviewTopicRepository,
    CandidateInterviewConfigurationService,
    CandidateInterviewConfigurationRepository,
  ],
})
export class InterviewsModule {}
