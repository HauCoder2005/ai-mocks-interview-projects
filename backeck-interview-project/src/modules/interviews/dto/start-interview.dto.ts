import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class StartInterviewDto {
  @ApiProperty({
    example: 'Backend Engineer',
  })
  @IsString()
  position!: string;

  @ApiProperty({
    example: 'Senior',
  })
  @IsString()
  experienceLevel!: string;

  @ApiProperty({
    example: ['NestJS', 'PostgreSQL', 'Redis'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  technologies!: string[];

  @ApiProperty({
    example: ['Clean Architecture', 'API Security'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  focusTopics!: string[];

  @ApiPropertyOptional({
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  questionCount?: number;

  @ApiPropertyOptional({
    default: 30,
    minimum: 5,
    maximum: 180,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(180)
  durationMinutes?: number;
}
