import { AdminInterviewLevelModel } from '../../../models/admin-interview-level.model';

/*
 * Đại diện cho kết quả truy vấn danh sách Interview Level từ Repository.
 * items là danh sách level đã được map sang domain model.
 * total là tổng số bản ghi trong bảng interview_levels.
 */
export interface AdminInterviewLevelListQueryResult {
  items: AdminInterviewLevelModel[];
  total: number;
}
