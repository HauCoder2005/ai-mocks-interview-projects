import { AdminInterviewPositionModel } from '../models/admin-interview-position.model';

/*
 * File này định nghĩa kiểu dữ liệu trả về từ Repository.
 *
 * Repository không chỉ trả danh sách Position,
 * mà còn trả thêm total để Service tạo meta cho ApiResponseWithMeta.
 *
 * items:
 * - Danh sách Position đã được map từ Prisma record sang Model.
 *
 * total:
 * - Tổng số Position lấy được theo điều kiện query hiện tại.
 * - Hiện tại chưa phân trang nên total = items.length.
 *
 * Lý do tách file:
 * - Không nhét interface trực tiếp trong Repository.
 * - Repository chỉ tập trung query dữ liệu.
 * - Service nhìn return type là biết Repository trả cả items và total.
 */
export interface AdminInterviewPositionListQueryResult {
  items: AdminInterviewPositionModel[];
  total: number;
}