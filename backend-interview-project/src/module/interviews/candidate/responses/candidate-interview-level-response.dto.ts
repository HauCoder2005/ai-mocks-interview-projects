import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/*
 * Response DTO cho Interview Level ở phía Candidate.
 * Candidate dùng dữ liệu này để hiển thị danh sách Level khi cấu hình phỏng vấn.
 */
export class CandidateInterviewLevelResponseDto {
  @ApiProperty({ example: 1, description: 'ID Level.' })
  id!: number;

  @ApiProperty({ example: 'Senior', description: 'Tên Level.' })
  name!: string;

  @ApiProperty({ example: 'SENIOR', description: 'Mã định danh Level.' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Level dành cho ứng viên có nhiều kinh nghiệm.',
    nullable: true,
    description: 'Mô tả Level.',
  })
  description!: string | null;

  @ApiProperty({ example: 5, description: 'Thứ tự hiển thị.' })
  displayOrder!: number;

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
