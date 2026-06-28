import { ApiListMeta } from 'src/shared/responses/api-response.interface';

import { AdminInterviewQuestionBankResponseDto } from '../../responses/admin-interview-question-bank-response.dto';

export interface AdminInterviewQuestionBankListResponseResult {
  data: AdminInterviewQuestionBankResponseDto[];
  meta: ApiListMeta;
}
