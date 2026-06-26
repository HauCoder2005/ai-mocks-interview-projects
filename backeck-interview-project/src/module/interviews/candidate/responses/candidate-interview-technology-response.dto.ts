import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/*
 * Response DTO cho Interview Technology ở phía Candidate.
 * Candidate dùng dữ liệu này để hiển thị danh sách Technology khi cấu hình phỏng vấn.
 */
export class CandidateInterviewTechnologyResponseDto {
  @ApiProperty({ example: 1, description: 'ID Technology.' })
  id!: number;

  @ApiProperty({ example: 'NestJS', description: 'Tên Technology.' })
  name!: string;

  @ApiProperty({ example: 'nestjs', description: 'Slug Technology.' })
  slug!: string;

  @ApiProperty({ example: 'NESTJS', description: 'Mã định danh Technology.' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Framework Node.js dùng để xây dựng backend.',
    nullable: true,
    description: 'Mô tả Technology.',
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
