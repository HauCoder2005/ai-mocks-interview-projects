import { CandidateInterviewLevelModel } from '../../models/candidate-interview-level.model';

/*
 * Đại diện cho kết quả Repository trả về khi lấy danh sách Interview Level.
 * items là danh sách Level đã được map sang CandidateInterviewLevelModel.
 * total là tổng số Level tìm được để Service tạo meta cho API list.
 */
export interface CandidateInterviewLevelListResult {
  items: CandidateInterviewLevelModel[];
  total: number;
}