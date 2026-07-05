import { CandidateInterviewPositionModel } from '../../models/candidate-interview-position.model';

/*
 * File này định nghĩa kiểu dữ liệu trả về từ Repository.
 *
 * Repository không chỉ trả về danh sách Position nữa,
 * mà còn trả thêm total để Service có dữ liệu tạo meta cho ApiResponse.
 *
 * items:
 * - Là danh sách Position đã được map từ Prisma record sang Model.
 *
 * total:
 * - Là tổng số Position tìm được theo điều kiện query.
 * - Hiện tại chưa phân trang nên total = items.length.
 * - Sau này nếu có phân trang, total có thể là tổng số bản ghi trong database,
 *   còn items chỉ là số bản ghi của trang hiện tại.
 *
 * Lý do tách file:
 * - Không nhét interface vào Repository.
 * - Giữ Repository chỉ tập trung query dữ liệu.
 * - Khi nhiều service khác cần dùng lại kiểu result này thì import được ngay.
 */
export interface CandidateInterviewPositionListResult {
  items: CandidateInterviewPositionModel[];
  total: number;
}
