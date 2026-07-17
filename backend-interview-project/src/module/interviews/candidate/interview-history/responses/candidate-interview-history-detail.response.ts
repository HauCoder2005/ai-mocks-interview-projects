import { CandidateInterviewHistoryItemResponse } from './candidate-interview-history-item.response';
import { CandidateInterviewHistoryReportResponse } from './candidate-interview-history-report.response';

export class CandidateInterviewHistoryDetailResponse extends CandidateInterviewHistoryItemResponse {
  questions!: any[];
  report!: CandidateInterviewHistoryReportResponse | null;
}
