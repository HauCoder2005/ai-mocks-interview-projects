import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/*
 * Response DTO cho Interview Topic ở phía Admin.
 * Admin dùng dữ liệu này để quản lý master data focus topics.
 */
export class AdminInterviewTopicResponseDto {
  @ApiProperty({ example: 1, description: 'ID Topic.' })
  id!: number;

  @ApiProperty({ example: 'REST API', description: 'Tên Topic.' })
  name!: string;

  @ApiProperty({ example: 'REST_API', description: 'Mã định danh Topic.' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Các câu hỏi về thiết kế và triển khai REST API.',
    nullable: true,
    description: 'Mô tả Topic.',
  })
  description!: string | null;

  @ApiProperty({ example: true, description: 'Trạng thái active.' })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-06-26T00:00:00.000Z',
    description: 'Thời điểm tạo.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-26T00:00:00.000Z',
    description: 'Thời điểm cập nhật.',
  })
  updatedAt!: Date;
}
