import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  interview_question_banks_difficulty,
  interview_question_banks_question_type,
} from 'generated/prisma/client';

import { CreateInterviewQuestionBankOptionDto } from './create-interview-question-bank-option.dto';

/*
 * Parse options từ Swagger form input khi cập nhật.
 * Nếu không truyền options thì giữ undefined để service không replace options cũ.
 */
function transformUpdateOptions(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (Array.isArray(value)) {
    return plainToInstance(CreateInterviewQuestionBankOptionDto, value);
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);

      if (Array.isArray(parsedValue)) {
        return plainToInstance(
          CreateInterviewQuestionBankOptionDto,
          parsedValue,
        );
      }
    } catch {
      return value;
    }
  }

  return value;
}

/*
 * DTO nhận dữ liệu khi Admin cập nhật câu hỏi trong Interview Question Bank.
 */
export class UpdateInterviewQuestionBankDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID Topic active mà câu hỏi thuộc về.',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  topicId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID Technology active mà câu hỏi thuộc về.',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  technologyId?: number;

  @ApiPropertyOptional({
    example: 'Decorator nào dùng để khai báo provider trong NestJS?',
    description: 'Tiêu đề câu hỏi.',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example:
      'Decorator nào dùng để đánh dấu một class là provider trong NestJS?',
    description: 'Nội dung chi tiết của câu hỏi.',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    enum: interview_question_banks_question_type,
    example: interview_question_banks_question_type.MCQ,
    description: 'Loại câu hỏi.',
  })
  @IsOptional()
  @IsEnum(interview_question_banks_question_type)
  questionType?: interview_question_banks_question_type;

  @ApiPropertyOptional({
    enum: interview_question_banks_difficulty,
    example: interview_question_banks_difficulty.EASY,
    description: 'Độ khó của câu hỏi.',
  })
  @IsOptional()
  @IsEnum(interview_question_banks_difficulty)
  difficulty?: interview_question_banks_difficulty;

  @ApiPropertyOptional({
    example: 'Đáp án đúng là @Injectable().',
    description: 'Đáp án kỳ vọng hoặc gợi ý chấm điểm.',
  })
  @IsOptional()
  @IsString()
  expectedAnswer?: string;

  @ApiPropertyOptional({
    type: String,
    example: '[{"content":"@Injectable()","isCorrect":true,"displayOrder":1}]',
    description: `Nếu truyền lựa chọn, hệ thống sẽ thay thế 
      toàn bộ lựa chọn cũ bằng JSON array string mới.`,
  })
  @Transform(({ value }) => transformUpdateOptions(value))
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInterviewQuestionBankOptionDto)
  options?: CreateInterviewQuestionBankOptionDto[];
}
