import { ApiListMeta } from 'src/shared/responses/api-response.interface';

import { AdminInterviewPositionResponseDto } from '../../../responses/admin-interview-position-response.dto';

/*
 * File này định nghĩa kiểu dữ liệu trả về từ Service cho Controller.
 *
 * Service không trả thẳng mảng Position nữa,
 * mà trả data + meta để Controller đưa vào ApiResponseWithMeta.
 *
 * data:
 * - Danh sách Position đã được map sang ResponseDto.
 *
 * meta:
 * - Thông tin mô tả danh sách.
 * - Hiện tại gồm total và itemCount.
 *
 * Lý do tách file:
 * - Không nhét interface trực tiếp trong Service.
 * - Service chỉ tập trung xử lý nghiệp vụ.
 * - Controller nhìn return type là biết response này bắt buộc có data và meta.
 */
export interface AdminInterviewPositionListResponseResult {
  data: AdminInterviewPositionResponseDto[];
  meta: ApiListMeta;
}