import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export type SortOrder = 'ASC' | 'DESC';

/**
 * DTO phân trang chuẩn cho các endpoint dạng danh sách.
 *
 * DTO nằm ở shared để mọi module dùng cùng quy ước `page`, `take` và `order`,
 * giúp lớp API giữ một hợp đồng phân trang thống nhất khi mở rộng nghiệp vụ.
 */
export class PageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take = 10;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: SortOrder = 'DESC';

  /**
   * Tính offset cho database query dựa trên page hiện tại.
   *
   * @returns Số bản ghi cần bỏ qua.
   */
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
