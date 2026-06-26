import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CandidateInterviewPositionResponseDto {
  @ApiProperty({ example: 1, description: 'ID Position.' })
  id!: number;

  @ApiProperty({ example: 'Backend Developer', description: 'Tên Position.' })
  name!: string;

  @ApiProperty({
    example: 'BACKEND_DEVELOPER',
    description: 'Mã định danh Position.',
  })
  code!: string;

  @ApiPropertyOptional({
    example: 'Vị trí backend tập trung vào API và database.',
    nullable: true,
    description: 'Mô tả Position.',
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
