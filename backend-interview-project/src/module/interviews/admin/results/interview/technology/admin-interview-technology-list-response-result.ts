import { ApiListMeta } from 'src/shared/responses/api-response.interface';
import { AdminInterviewTechnologyResponseDto } from '../../../responses/admin-interview-technology-response.dto';

/*
 * Đại diện cho kết quả Service trả về cho Controller khi lấy danh sách Interview Technology.
 * data là danh sách Technology DTO trả về API.
 * meta chứa total và itemCount cho API list.
 */
export interface AdminInterviewTechnologyListResponseResult {
  data: AdminInterviewTechnologyResponseDto[];
  meta: ApiListMeta;
}
