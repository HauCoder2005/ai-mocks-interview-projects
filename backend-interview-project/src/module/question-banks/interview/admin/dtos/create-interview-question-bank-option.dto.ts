import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

/*
 * DTO nhận dữ liệu option khi Admin tạo câu hỏi MCQ.
 */
export class CreateInterviewQuestionBankOptionDto {
  @ApiProperty({
    example: '@Injectable()',
    description: 'Nội dung lựa chọn trả lời.',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    example: true,
    description: 'Đánh dấu option có phải đáp án đúng hay không.',
  })
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true;
    }

    if (value === false || value === 'false' || value === 0 || value === '0') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty({
    example: 1,
    description: 'Thứ tự hiển thị option.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder!: number;
}
