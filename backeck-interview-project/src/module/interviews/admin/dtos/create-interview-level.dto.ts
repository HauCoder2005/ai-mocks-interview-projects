import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInterviewLevelDto {
  @ApiProperty({
    example: 'Senior',
    description: 'Tên Interview Level.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    example: 'SENIOR',
    description: 'Mã định danh Interview Level.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiPropertyOptional({
    example: 'Level dành cho ứng viên có nhiều kinh nghiệm.',
    description: 'Mô tả Interview Level.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 5,
    description: 'Thứ tự hiển thị của Level.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder!: number;
}
