import { Module } from '@nestjs/common';
import { TranscriptFillerWordService } from './transcript-filler-word.service';
import { TranscriptNormalizationService } from './transcript-normalization.service';
import { TranscriptTechnicalTermService } from './transcript-technical-term.service';

@Module({
  providers: [
    TranscriptNormalizationService,
    TranscriptFillerWordService,
    TranscriptTechnicalTermService,
  ],
  exports: [
    TranscriptNormalizationService,
    TranscriptFillerWordService,
    TranscriptTechnicalTermService,
  ],
})
export class TranscriptProcessingModule {}
