import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/*
 * DTO nhận dữ liệu khi Admin cập nhật Interview Topic.
 * Các field đều optional để hỗ trợ cập nhật từng phần.
 */
export class UpdateInterviewTopicDto {
  @ApiPropertyOptional({
    example: 'REST API',
    description: 'Tên Topic.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'REST_API',
    description: 'Mã định danh Topic.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code?: string;

  @ApiPropertyOptional({
    example: 'Các câu hỏi về thiết kế và triển khai REST API.',
    description: 'Mô tả Topic.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
