import { ApiListMeta } from 'src/shared/responses/api-response.interface';

import { CandidateInterviewPositionResponseDto } from '../../responses/candidate-interview-position-response.dto';

/*
 * File này định nghĩa kiểu dữ liệu trả về từ Service cho Controller.
 *
 * Service không trả thẳng mảng Position nữa,
 * mà trả về data + meta để Controller đưa vào ApiResponseWithMeta.
 *
 * data:
 * - Là danh sách Position đã được map sang ResponseDto.
 * - Đây là dữ liệu sạch để frontend nhận.
 *
 * meta:
 * - Là thông tin mô tả danh sách.
 * - Hiện tại gồm total và itemCount.
 * - total là tổng số bản ghi theo điều kiện query.
 * - itemCount là số item thực tế đang trả về trong data.
 *
 * Lý do tách file:
 * - Không nhét interface vào Service.
 * - Service chỉ tập trung xử lý nghiệp vụ.
 * - Controller nhìn vào return type sẽ biết response này bắt buộc có data và meta.
 */
export interface CandidateInterviewPositionOptionsResult {
  data: CandidateInterviewPositionResponseDto[];
  meta: ApiListMeta;
}