import { ApiListMeta } from 'src/shared/responses/api-response.interface';
import { AdminInterviewTopicResponseDto } from '../../../responses/admin-interview-topic-response.dto';

/*
 * Đại diện cho kết quả Service trả về cho Controller khi lấy danh sách Interview Topic.
 * data là danh sách Topic DTO trả về API.
 * meta chứa total và itemCount cho API list.
 */
export interface AdminInterviewTopicListResponseResult {
  data: AdminInterviewTopicResponseDto[];
  meta: ApiListMeta;
}
