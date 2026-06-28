import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
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
 * Parse options từ Swagger form input.
 * Nếu Admin không nhập options khi tạo câu hỏi thì trả về mảng rỗng.
 */
function transformCreateOptions(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return [];
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
 * DTO nhận dữ liệu khi Admin tạo một câu hỏi trong Interview Question Bank.
 */
export class CreateInterviewQuestionBankDto {
  @ApiProperty({
    example: 1,
    description: 'ID Topic active mà câu hỏi thuộc về.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  topicId!: number;

  @ApiProperty({
    example: 2,
    description: 'ID Technology active mà câu hỏi thuộc về.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  technologyId!: number;

  @ApiProperty({
    example: 'Decorator nào dùng để khai báo provider trong NestJS?',
    description: 'Tiêu đề câu hỏi.',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    example:
      'Decorator nào dùng để đánh dấu một class là provider trong NestJS?',
    description: 'Nội dung chi tiết của câu hỏi.',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    enum: interview_question_banks_question_type,
    example: interview_question_banks_question_type.MCQ,
    description: 'Loại câu hỏi.',
  })
  @IsEnum(interview_question_banks_question_type)
  questionType!: interview_question_banks_question_type;

  @ApiProperty({
    enum: interview_question_banks_difficulty,
    example: interview_question_banks_difficulty.EASY,
    description: 'Độ khó của câu hỏi.',
  })
  @IsEnum(interview_question_banks_difficulty)
  difficulty!: interview_question_banks_difficulty;

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
    description:
      'Danh sách option dạng JSON array string, chỉ dùng cho câu hỏi MCQ.',
  })
  @Transform(({ value }) => transformCreateOptions(value))
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInterviewQuestionBankOptionDto)
  options: CreateInterviewQuestionBankOptionDto[] = [];
}
