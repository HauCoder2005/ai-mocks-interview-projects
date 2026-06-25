import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';

import { AdminInterviewMasterDataController } from './admin/controllers/admin-interview-master-data.controller';
import { AdminInterviewPositionRepository } from './admin/repositories/admin-interview-position.repository';
import { AdminInterviewMasterDataService } from './admin/services/admin-interview-master-data.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminInterviewMasterDataController],
  providers: [
    AdminInterviewMasterDataService,
    AdminInterviewPositionRepository,
  ],
})
export class InterviewsModule {}