import { ApiListMeta } from 'src/shared/responses/api-response.interface';

import { CandidateInterviewLevelResponseDto } from '../../responses/candidate-interview-level-response.dto';

/*
 * Đại diện cho kết quả Service trả về khi Candidate lấy danh sách Interview Level options.
 * data là danh sách Level DTO dùng để hiển thị trên giao diện chọn cấu hình phỏng vấn.
 * meta chứa total và itemCount cho API list.
 */
export interface CandidateInterviewLevelOptionsResult {
  data: CandidateInterviewLevelResponseDto[];
  meta: ApiListMeta;
}