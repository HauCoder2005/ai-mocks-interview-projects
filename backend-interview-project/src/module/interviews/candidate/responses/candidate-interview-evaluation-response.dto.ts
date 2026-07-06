import { ApiProperty } from '@nestjs/swagger';

export class CandidateInterviewEvaluationResponseDto {
  @ApiProperty({ example: '2' })
  sessionId!: string;

  @ApiProperty({ example: 'turn-test' })
  turnId!: string;

  @ApiProperty({ example: 75 })
  overallScore!: number;

  @ApiProperty({ example: 70 })
  technicalScore!: number;

  @ApiProperty({ example: 80 })
  communicationScore!: number;

  @ApiProperty({ example: 85 })
  relevanceScore!: number;

  @ApiProperty({ example: ['Có nhắc đúng NestJS và Prisma'] })
  strengths!: string[];

  @ApiProperty({ example: ['Cần giải thích rõ hơn cách tổ chức module'] })
  weaknesses!: string[];

  @ApiProperty({ example: 'Câu trả lời bám chủ đề nhưng còn thiếu ví dụ.' })
  feedback!: string;

  @ApiProperty({ example: 'Em dùng NestJS để tổ chức API theo module...' })
  improvedAnswerSuggestion!: string;

  @ApiProperty({
    example:
      'Bạn có thể giải thích cách bạn tổ chức module, service và repository trong NestJS không?',
  })
  nextQuestion!: string;

  @ApiProperty({ example: true })
  shouldContinue!: boolean;

  @ApiProperty({ example: 'NestJS module architecture' })
  topicFocus!: string;

  @ApiProperty({ example: 'qwen3:4b' })
  model!: string;
}
