import { ApiProperty } from '@nestjs/swagger';

/*
 * Response DTO cho option của câu hỏi MCQ trong Interview Question Bank.
 */
export class AdminInterviewQuestionBankOptionResponseDto {
  @ApiProperty({ example: 1, description: 'ID option.' })
  id!: number;

  @ApiProperty({ example: '@Injectable()', description: 'Nội dung option.' })
  content!: string;

  @ApiProperty({ example: true, description: 'Option có phải đáp án đúng.' })
  isCorrect!: boolean;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị option.' })
  displayOrder!: number;
}
