import { ApiListMeta } from 'src/shared/responses/api-response.interface';
import { CandidateInterviewTechnologyResponseDto } from '../../responses/candidate-interview-technology-response.dto';

/*
 * Đại diện cho kết quả Service trả về khi Candidate lấy danh sách Interview Technology options.
 * data là danh sách Technology DTO dùng để hiển thị trên giao diện chọn cấu hình phỏng vấn.
 * meta chứa total và itemCount cho API list.
 */
export interface CandidateInterviewTechnologyOptionsResult {
  data: CandidateInterviewTechnologyResponseDto[];
  meta: ApiListMeta;
}