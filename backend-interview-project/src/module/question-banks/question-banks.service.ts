import { Injectable } from '@nestjs/common';

import { AdminInterviewQuestionBankModel } from './interview/admin/models/admin-interview-question-bank.model';
import { AdminInterviewQuestionBankRepository } from './interview/admin/repositories/admin-interview-question-bank.repository';

@Injectable()
export class QuestionBanksService {
  /*
   * Inject repository của Interview Question Bank để module khác có thể lấy câu hỏi.
   */
  constructor(
    private readonly adminInterviewQuestionBankRepository: AdminInterviewQuestionBankRepository,
  ) {}

  /*
   * Lấy một câu hỏi Interview Question Bank theo id.
   * Service tổng dùng cho module khác khi cần tái sử dụng nguồn câu hỏi.
   */
  async getInterviewQuestionBankById(
    id: number,
  ): Promise<AdminInterviewQuestionBankModel | null> {
    return this.adminInterviewQuestionBankRepository.findById(id);
  }
}
