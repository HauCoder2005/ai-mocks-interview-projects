import { PageOptionsDto } from './page-options.dto';

interface PageMetaParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

/**
 * Metadata phân trang chuẩn trả về cùng danh sách dữ liệu.
 *
 * Các field được tính tập trung tại đây để controller/service không tự lặp lại
 * công thức phân trang và tránh lệch hợp đồng response giữa các module.
 */
export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / pageOptionsDto.take);
    this.hasPreviousPage = pageOptionsDto.page > 1;
    this.hasNextPage = pageOptionsDto.page < this.pageCount;
  }
}
