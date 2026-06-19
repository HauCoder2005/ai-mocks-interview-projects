import { PageMetaDto } from './page-meta.dto';

/**
 * Response DTO chuẩn cho dữ liệu dạng danh sách có phân trang.
 *
 * Lớp này giữ `data` và `meta` ở cùng một cấu trúc để global response
 * interceptor có thể nhận diện và đưa `meta` lên envelope API thống nhất.
 */
export class PageDto<TData> {
  constructor(
    readonly data: TData[],
    readonly meta: PageMetaDto,
  ) {}
}
