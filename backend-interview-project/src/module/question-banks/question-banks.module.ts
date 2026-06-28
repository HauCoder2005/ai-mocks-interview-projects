import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import SecurityModule from 'src/shared/security/security.module';

import { AdminInterviewQuestionBankController } from './interview/admin/controllers/admin-interview-question-bank.controller';
import { AdminInterviewQuestionBankRepository } from './interview/admin/repositories/admin-interview-question-bank.repository';
import { AdminInterviewQuestionBankService } from './interview/admin/services/admin-interview-question-bank.service';
import { QuestionBanksService } from './question-banks.service';

@Module({
  imports: [PrismaModule, SecurityModule],
  controllers: [AdminInterviewQuestionBankController],
  providers: [
    AdminInterviewQuestionBankService,
    AdminInterviewQuestionBankRepository,
    QuestionBanksService,
  ],
  exports: [QuestionBanksService],
})
export class QuestionBanksModule {}
