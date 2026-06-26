import { ApiListMeta } from 'src/shared/responses/api-response.interface';
import { CandidateInterviewTopicResponseDto } from '../../responses/candidate-interview-topic-response.dto';

/*
 * Đại diện cho kết quả Service trả về khi Candidate lấy danh sách Interview Topic options.
 * data là danh sách Topic DTO dùng để hiển thị trên giao diện chọn focus topics.
 * meta chứa total và itemCount cho API list.
 */
export interface CandidateInterviewTopicOptionsResult {
  data: CandidateInterviewTopicResponseDto[];
  meta: ApiListMeta;
}
