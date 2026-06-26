import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/*
 * DTO nhận dữ liệu khi Admin tạo mới Interview Technology.
 * Technology là công nghệ để Candidate chọn khi cấu hình buổi phỏng vấn.
 */
export class CreateInterviewTechnologyDto {
  @ApiProperty({
    example: 'NestJS',
    description: 'Tên Technology.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'nestjs',
    description: 'Slug của Technology.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug!: string;

  @ApiProperty({
    example: 'NESTJS',
    description: 'Mã định danh Technology.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @ApiPropertyOptional({
    example: 'Framework Node.js dùng để xây dựng backend.',
    description: 'Mô tả Technology.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
