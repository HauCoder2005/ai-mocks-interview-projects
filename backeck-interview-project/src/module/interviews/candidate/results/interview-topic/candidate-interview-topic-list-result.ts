import { CandidateInterviewTopicModel } from '../../models/candidate-interview-topic.model';

/*
 * Đại diện cho kết quả Repository trả về khi lấy danh sách Interview Topic.
 * items là danh sách Topic đã được map sang CandidateInterviewTopicModel.
 * total là tổng số Topic tìm được để Service tạo meta cho API list.
 */
export interface CandidateInterviewTopicListResult {
  items: CandidateInterviewTopicModel[];
  total: number;
}
