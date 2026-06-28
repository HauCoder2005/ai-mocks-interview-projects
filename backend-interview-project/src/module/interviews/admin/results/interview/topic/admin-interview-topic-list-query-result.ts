import { AdminInterviewTopicModel } from '../../../models/admin-interview-topic.model';

/*
 * Đại diện cho kết quả Repository trả về khi lấy danh sách Interview Topic.
 * items là danh sách Topic đã được map sang AdminInterviewTopicModel.
 * total là tổng số Topic tìm được để Service tạo meta cho API list.
 */
export interface AdminInterviewTopicListQueryResult {
  items: AdminInterviewTopicModel[];
  total: number;
}
