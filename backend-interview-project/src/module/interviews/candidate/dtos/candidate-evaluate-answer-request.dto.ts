import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CandidateEvaluateAnswerRequestDto {
  @ApiPropertyOptional({ example: 'turn-test' })
  @IsOptional()
  @IsString()
  turnId?: string;

  @ApiProperty({
    example: 'Bạn hãy giải thích kinh nghiệm của bạn với NestJS.',
  })
  @IsString()
  @IsNotEmpty()
  question!: string;

  @ApiPropertyOptional({ example: 'ờ em có làm nest js với my sql' })
  @IsOptional()
  @IsString()
  rawTranscript?: string;

  @ApiPropertyOptional({ example: 'Em có làm NestJS với MySQL.' })
  @IsOptional()
  @IsString()
  normalizedTranscript?: string;

  @ApiPropertyOptional({ example: [], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousQuestions?: string[];

  @ApiPropertyOptional({ example: [], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousAnswers?: string[];

  @ApiPropertyOptional({ example: 'Backend Developer' })
  @IsOptional()
  @IsString()
  mainTopic?: string;

  @ApiPropertyOptional({ example: 'Backend Developer' })
  @IsOptional()
  @IsString()
  positionName?: string;

  @ApiPropertyOptional({ example: 'Junior' })
  @IsOptional()
  @IsString()
  levelName?: string;

  @ApiPropertyOptional({ example: 'TECHNICAL' })
  @IsOptional()
  @IsString()
  interviewType?: string;
}
