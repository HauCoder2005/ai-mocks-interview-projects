import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class StartCandidateInterviewSessionDto {
  @ApiProperty({
    example: 1,
    description: 'ID của Position đang active.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({
    example: 1,
    description: 'ID của Experience Level đang active.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  levelId!: number;
}
