import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/*
 * DTO nhận dữ liệu khi Admin cập nhật Interview Technology.
 * Các field đều optional vì Admin có thể chỉ cập nhật một phần thông tin.
 */
export class UpdateInterviewTechnologyDto {
  @ApiPropertyOptional({
    example: 'NestJS',
    description: 'Tên Technology.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'nestjs',
    description: 'Slug của Technology.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({
    example: 'NESTJS',
    description: 'Mã định danh Technology.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  code?: string;

  @ApiPropertyOptional({
    example: 'Framework Node.js dùng để xây dựng backend.',
    description: 'Mô tả Technology.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
