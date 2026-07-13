import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CompleteCandidateInterviewSessionDto {
  @ApiPropertyOptional({ example: 82.5, minimum: 0, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore?: number;
}
