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

export class CreateMockTestDto {
  @ApiProperty({ example: 'NestJS Core Concepts', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: 'nestjs-core-concepts', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug!: string;

  @ApiPropertyOptional({ example: 'Kiểm tra kiến thức NestJS nền tảng.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/nestjs.png' })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ example: 30 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;
}
