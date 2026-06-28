import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  interview_question_banks_difficulty,
  interview_question_banks_question_type,
} from 'generated/prisma/client';

import { AdminInterviewQuestionBankOptionResponseDto } from './admin-interview-question-bank-option-response.dto';

class AdminInterviewQuestionBankTopicResponseDto {
  @ApiProperty({ example: 1, description: 'ID Topic.' })
  id!: number;

  @ApiProperty({ example: 'NestJS', description: 'Tên Topic.' })
  name!: string;

  @ApiProperty({ example: 'NESTJS', description: 'Mã Topic.' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Các câu hỏi về NestJS.',
    nullable: true,
    description: 'Mô tả Topic.',
  })
  description!: string | null;
}

class AdminInterviewQuestionBankTechnologyResponseDto {
  @ApiProperty({ example: 2, description: 'ID Technology.' })
  id!: number;

  @ApiProperty({ example: 'NestJS', description: 'Tên Technology.' })
  name!: string;

  @ApiProperty({ example: 'nestjs', description: 'Slug Technology.' })
  slug!: string;

  @ApiProperty({ example: 'NESTJS', description: 'Mã Technology.' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Backend framework cho Node.js.',
    nullable: true,
    description: 'Mô tả Technology.',
  })
  description!: string | null;
}

/*
 * Response DTO cho câu hỏi trong Interview Question Bank ở phía Admin.
 */
export class AdminInterviewQuestionBankResponseDto {
  @ApiProperty({ example: 1, description: 'ID câu hỏi.' })
  id!: number;

  @ApiProperty({
    type: AdminInterviewQuestionBankTopicResponseDto,
    description: 'Topic liên kết với câu hỏi.',
  })
  topic!: AdminInterviewQuestionBankTopicResponseDto;

  @ApiProperty({
    type: AdminInterviewQuestionBankTechnologyResponseDto,
    description: 'Technology liên kết với câu hỏi.',
  })
  technology!: AdminInterviewQuestionBankTechnologyResponseDto;

  @ApiProperty({
    example: 'Decorator nào dùng để khai báo provider trong NestJS?',
    description: 'Tiêu đề câu hỏi.',
  })
  title!: string;

  @ApiProperty({
    example:
      'Decorator nào dùng để đánh dấu một class là provider trong NestJS?',
    description: 'Nội dung câu hỏi.',
  })
  content!: string;

  @ApiProperty({
    enum: interview_question_banks_question_type,
    example: interview_question_banks_question_type.MCQ,
    description: 'Loại câu hỏi.',
  })
  questionType!: interview_question_banks_question_type;

  @ApiProperty({
    enum: interview_question_banks_difficulty,
    example: interview_question_banks_difficulty.EASY,
    description: 'Độ khó.',
  })
  difficulty!: interview_question_banks_difficulty;

  @ApiPropertyOptional({
    example: 'Đáp án đúng là @Injectable().',
    nullable: true,
    description: 'Đáp án kỳ vọng.',
  })
  expectedAnswer!: string | null;

  @ApiProperty({
    type: [AdminInterviewQuestionBankOptionResponseDto],
    description: 'Danh sách option của câu hỏi MCQ.',
  })
  options!: AdminInterviewQuestionBankOptionResponseDto[];

  @ApiProperty({ example: 1, description: 'ID user Admin đã tạo câu hỏi.' })
  createdBy!: number;

  @ApiProperty({
    example: '2026-06-26T00:00:00.000Z',
    description: 'Thời điểm tạo.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-06-26T00:00:00.000Z',
    description: 'Thời điểm cập nhật.',
  })
  updatedAt!: Date;
}
