import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateInterviewPositionDto {
  @ApiPropertyOptional({
    example: 'Backend Developer',
    description: 'Tên vị trí phỏng vấn.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'BACKEND_DEVELOPER',
    description: 'Mã định danh vị trí phỏng vấn.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  code?: string;

  @ApiPropertyOptional({
    example: 'Vị trí backend tập trung vào API và database.',
    description: 'Mô tả vị trí phỏng vấn.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
