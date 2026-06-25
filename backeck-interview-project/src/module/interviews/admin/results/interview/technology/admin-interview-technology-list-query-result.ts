import { AdminInterviewTechnologyModel } from '../../../models/admin-interview-technology.model';

/*
 * Đại diện cho kết quả Repository trả về khi lấy danh sách Interview Technology.
 * items là danh sách Technology đã được map sang AdminInterviewTechnologyModel.
 * total là tổng số Technology tìm được để Service tạo meta cho API list.
 */
export interface AdminInterviewTechnologyListQueryResult {
  items: AdminInterviewTechnologyModel[];
  total: number;
}
