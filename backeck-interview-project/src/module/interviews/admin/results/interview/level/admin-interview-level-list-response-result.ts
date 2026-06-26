import { ApiListMeta } from 'src/shared/responses/api-response.interface';
import { AdminInterviewLevelResponseDto } from '../../../responses/admin-interview-level-response.dto';

/*
 * Đại diện cho kết quả Service trả về cho Controller khi lấy danh sách Interview Level.
 * data là danh sách DTO trả về API.
 * meta dùng để chứa thông tin tổng số bản ghi và số item hiện tại.
 */
export interface AdminInterviewLevelListResponseResult {
  data: AdminInterviewLevelResponseDto[];
  meta: ApiListMeta;
}