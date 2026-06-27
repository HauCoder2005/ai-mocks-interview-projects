import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { interview_configurations_interview_type } from 'generated/prisma/client';

export class CandidateInterviewConfigurationPositionResponseDto {
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
}

export class CandidateInterviewConfigurationLevelResponseDto {
  @ApiProperty({ example: 2, description: 'ID Level.' })
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

  @ApiProperty({ example: 5, description: 'Thứ tự hiển thị Level.' })
  displayOrder!: number;
}

export class CandidateInterviewConfigurationTechnologyResponseDto {
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
}

export class CandidateInterviewConfigurationTopicResponseDto {
  @ApiProperty({ example: 2, description: 'ID Topic.' })
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
}

/*
 * Response DTO cho Interview Configuration ở phía Candidate.
 * DTO này ẩn raw relation id và chỉ trả dữ liệu cần hiển thị.
 */
export class CandidateInterviewConfigurationResponseDto {
  @ApiProperty({ example: 1, description: 'ID Interview Configuration.' })
  id!: number;

  @ApiProperty({
    example: 10,
    description: 'ID Candidate sở hữu configuration.',
  })
  userId!: number;

  @ApiProperty({
    example: 'Backend NestJS Interview',
    description: 'Tên configuration.',
  })
  name!: string;

  @ApiProperty({
    enum: interview_configurations_interview_type,
    example: interview_configurations_interview_type.MIXED,
    description: 'Loại phỏng vấn.',
  })
  interviewType!: interview_configurations_interview_type;

  @ApiProperty({ example: 10, description: 'Số lượng câu hỏi.' })
  questionCount!: number;

  @ApiProperty({ example: 30, description: 'Thời lượng tính bằng phút.' })
  durationMinutes!: number;

  @ApiPropertyOptional({
    example: 'Mock interview for NestJS backend role',
    nullable: true,
    description: 'Mô tả configuration.',
  })
  description!: string | null;

  @ApiProperty({
    type: () => CandidateInterviewConfigurationPositionResponseDto,
    description: 'Position đã chọn.',
  })
  position!: CandidateInterviewConfigurationPositionResponseDto;

  @ApiProperty({
    type: () => CandidateInterviewConfigurationLevelResponseDto,
    description: 'Level đã chọn.',
  })
  level!: CandidateInterviewConfigurationLevelResponseDto;

  @ApiProperty({
    type: () => CandidateInterviewConfigurationTechnologyResponseDto,
    isArray: true,
    description: 'Danh sách Technology đã chọn.',
  })
  technologies!: CandidateInterviewConfigurationTechnologyResponseDto[];

  @ApiProperty({
    type: () => CandidateInterviewConfigurationTopicResponseDto,
    isArray: true,
    description: 'Danh sách Topic đã chọn.',
  })
  topics!: CandidateInterviewConfigurationTopicResponseDto[];

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
