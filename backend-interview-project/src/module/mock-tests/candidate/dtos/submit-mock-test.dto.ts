import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class SubmitMockTestItemDto {
  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  questionId!: number;

  @ApiProperty({ example: 48 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  answerId!: number;
}

export class SubmitMockTestDto {
  @ApiProperty({ type: [SubmitMockTestItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitMockTestItemDto)
  answers!: SubmitMockTestItemDto[];
}
