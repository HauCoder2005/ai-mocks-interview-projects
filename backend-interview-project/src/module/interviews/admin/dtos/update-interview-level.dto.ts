import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateInterviewLevelDto {
  @ApiPropertyOptional({
    example: 'Senior',
    description: 'Tên Interview Level.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    example: 'SENIOR',
    description: 'Mã định danh Interview Level.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({
    example: 'Level dành cho ứng viên có nhiều kinh nghiệm.',
    description: 'Mô tả Interview Level.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Thứ tự hiển thị của Level.',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  displayOrder?: number;
}
