import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { interview_question_banks_difficulty } from 'generated/prisma/client';

export class MockTestQueryDto {
  @ApiPropertyOptional({ example: 'nestjs' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  technologyId?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  topicId?: number;

  @ApiPropertyOptional({ enum: interview_question_banks_difficulty })
  @IsOptional()
  @IsEnum(interview_question_banks_difficulty)
  difficulty?: interview_question_banks_difficulty;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 10;
}
