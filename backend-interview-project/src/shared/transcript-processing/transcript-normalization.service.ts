import { Injectable } from '@nestjs/common';
import { TranscriptFillerWordService } from './transcript-filler-word.service';
import { TranscriptTechnicalTermService } from './transcript-technical-term.service';

@Injectable()
export class TranscriptNormalizationService {
  constructor(
    private readonly fillerWordService: TranscriptFillerWordService,
    private readonly technicalTermService: TranscriptTechnicalTermService,
  ) {}

  /** Làm sạch transcript ở mức nhẹ, không viết lại hoặc thêm ý mới. */
  normalize(rawTranscript: string | null | undefined): string {
    if (!rawTranscript?.trim()) {
      return '';
    }

    const normalizedPunctuation = rawTranscript
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/([,.;:!?])\1+/g, '$1')
      .replace(/([,.;:!?])(?=\S)/g, '$1 ');

    const withoutFillers = this.fillerWordService.clean(normalizedPunctuation);
    const withTechnicalTerms =
      this.technicalTermService.normalize(withoutFillers);

    return withTechnicalTerms.replace(/\s+/g, ' ').trim();
  }
}
