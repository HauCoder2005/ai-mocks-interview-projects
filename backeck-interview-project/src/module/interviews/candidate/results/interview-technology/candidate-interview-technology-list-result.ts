import { CandidateInterviewTechnologyModel } from '../../models/candidate-interview-technology.model';

/*
 * Đại diện cho kết quả Repository trả về khi lấy danh sách Interview Technology.
 * items là danh sách Technology đã được map sang CandidateInterviewTechnologyModel.
 * total là tổng số Technology tìm được để Service tạo meta cho API list.
 */
export interface CandidateInterviewTechnologyListResult {
  items: CandidateInterviewTechnologyModel[];
  total: number;
}