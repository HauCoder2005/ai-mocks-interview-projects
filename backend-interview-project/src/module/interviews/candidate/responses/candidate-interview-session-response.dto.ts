import { ApiProperty } from '@nestjs/swagger';
import { interview_sessions_status } from 'generated/prisma/client';

export class CandidateInterviewSessionResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  sessionId!: number;

  @ApiProperty({ example: 1 })
  configurationId!: number;

  @ApiProperty({ example: 1 })
  positionId!: number;

  @ApiProperty({ example: 1 })
  levelId!: number;

  @ApiProperty({ example: 1 })
  attemptNumber!: number;

  @ApiProperty({
    enum: interview_sessions_status,
    example: interview_sessions_status.IN_PROGRESS,
  })
  status!: interview_sessions_status;

  @ApiProperty({ example: '2026-07-02T04:00:00.000Z' })
  startedAt!: Date;
}
