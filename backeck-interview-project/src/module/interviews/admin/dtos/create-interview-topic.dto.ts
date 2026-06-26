import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/*
 * DTO nhận dữ liệu khi Admin tạo mới Interview Topic.
 * Topic là nhóm nội dung phỏng vấn để Candidate chọn focus topics.
 */
export class CreateInterviewTopicDto {
  @ApiProperty({
    example: 'REST API',
    description: 'Tên Topic.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'REST_API',
    description: 'Mã định danh Topic.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @ApiPropertyOptional({
    example: 'Các câu hỏi về thiết kế và triển khai REST API.',
    description: 'Mô tả Topic.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
