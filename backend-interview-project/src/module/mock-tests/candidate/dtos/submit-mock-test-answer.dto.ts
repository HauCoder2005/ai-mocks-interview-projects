import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class SubmitMockTestAnswerDto {
  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  questionBankId!: number;

  @ApiProperty({ example: 48 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  selectedOptionId!: number;
}
