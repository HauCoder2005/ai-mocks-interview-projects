import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import SecurityModule from 'src/shared/security/security.module';
import { AdminMockTestController } from './admin/controllers/admin-mock-test.controller';
import { AdminMockTestService } from './admin/services/admin-mock-test.service';
import { CandidateMockTestController } from './candidate/controllers/candidate-mock-test.controller';
import { CandidateMockTestService } from './candidate/services/candidate-mock-test.service';
import { MockTestRepository } from './repositories/mock-test.repository';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [AdminMockTestController, CandidateMockTestController],
  providers: [
    AdminMockTestService,
    CandidateMockTestService,
    MockTestRepository,
  ],
})
export class MockTestsModule {}
