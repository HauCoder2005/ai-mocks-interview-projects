import { AdminInterviewQuestionBankModel } from '../../models/admin-interview-question-bank.model';

export interface AdminInterviewQuestionBankListQueryResult {
  items: AdminInterviewQuestionBankModel[];
  total: number;
}
