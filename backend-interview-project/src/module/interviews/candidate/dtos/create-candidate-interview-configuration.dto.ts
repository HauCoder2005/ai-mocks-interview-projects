import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { interview_configurations_interview_type } from 'generated/prisma/client';
import { toNumberArray } from 'src/shared/transformers/to-number-array.transformer';

/*
 * DTO nhận dữ liệu khi Candidate chốt cấu hình phỏng vấn.
 * userId không nằm trong body vì được lấy từ access token.
 */
export class CreateCandidateInterviewConfigurationDto {
  @ApiProperty({
    example: 'Backend NestJS Interview',
    description: 'Tên cấu hình phỏng vấn.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    example: 1,
    description: 'ID của Position đang active.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({
    example: 2,
    description: 'ID của Experience Level đang active.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  levelId!: number;

  @ApiProperty({
    enum: interview_configurations_interview_type,
    example: interview_configurations_interview_type.MIXED,
    description: 'Loại phỏng vấn.',
  })
  @IsEnum(interview_configurations_interview_type)
  interviewType!: interview_configurations_interview_type;

  @ApiProperty({
    example: 10,
    description: 'Số lượng câu hỏi trong buổi phỏng vấn.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  questionCount!: number;

  @ApiProperty({
    example: 30,
    description: 'Thời lượng phỏng vấn tính bằng phút.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiPropertyOptional({
    example: 'Mock interview for NestJS backend role',
    description: 'Mô tả cấu hình phỏng vấn.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '1,3',
    description:
      'Danh sách Technology ID. Trên Swagger form có thể nhập dạng 1,2,3.',
  })
  @Transform(({ value }: { value: unknown }) => toNumberArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  technologyIds!: number[];

  @ApiPropertyOptional({
    example: '2,4,5',
    description:
      'Danh sách Topic ID. Trên Swagger form có thể nhập dạng 2,4,5.',
  })
  @Transform(({ value }: { value: unknown }) => toNumberArray(value))
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  topicIds?: number[];
}
