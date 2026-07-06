import { ApiProperty } from '@nestjs/swagger';

export class CandidateAudioAnswerFileResponseDto {
  @ApiProperty({ example: 'interview-audio-bucket' })
  bucket!: string;

  @ApiProperty({
    example: 'interviews/12/session-35/turn-001/answer.mp3',
  })
  objectKey!: string;
}

export class CandidateAudioAnswerTranscriptionResponseDto {
  @ApiProperty({ example: 'medium' })
  model!: string;

  @ApiProperty({ example: 'vi' })
  language!: string;

  @ApiProperty({ example: 'vi', required: false })
  detectedLanguage?: string;
}

export class CandidateAudioAnswerResponseDto {
  @ApiProperty({ example: 'session-35' })
  sessionId!: string;

  @ApiProperty({ example: 'turn-001' })
  turnId!: string;

  @ApiProperty({ type: CandidateAudioAnswerFileResponseDto })
  audio!: CandidateAudioAnswerFileResponseDto;

  @ApiProperty({ example: 'text from audio' })
  transcript!: string;

  @ApiProperty({ example: 'raw text from Whisper' })
  rawTranscript!: string;

  @ApiProperty({ example: 'normalized transcript text' })
  normalizedTranscript!: string;

  @ApiProperty({ type: CandidateAudioAnswerTranscriptionResponseDto })
  transcription!: CandidateAudioAnswerTranscriptionResponseDto;
}
