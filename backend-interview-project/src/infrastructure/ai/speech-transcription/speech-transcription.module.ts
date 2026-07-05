import { Module } from '@nestjs/common';
import { SpeechTranscriptionService } from './speech-transcription.service';

@Module({
  providers: [SpeechTranscriptionService],
  exports: [SpeechTranscriptionService],
})
export class SpeechTranscriptionModule {}
