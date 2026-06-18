import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitInterviewAnswerDto {
  @ApiPropertyOptional({
    example:
      'Tôi sẽ bắt đầu bằng cách tách domain, application và infrastructure layer.',
  })
  @IsOptional()
  @IsString()
  textContent?: string;
}
