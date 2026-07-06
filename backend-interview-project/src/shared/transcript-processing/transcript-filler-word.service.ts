import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptFillerWordService {
  private readonly fillerPatterns = [
    /(^|[\s,.;:!?])kiểu\s+như(?=$|[\s,.;:!?])/giu,
    /(^|[\s,.;:!?])nói\s+chung\s+là(?=$|[\s,.;:!?])/giu,
    /(^|[\s,.;:!?])ừm(?=$|[\s,.;:!?])/giu,
    /(^|[\s,.;:!?])ờ(?=$|[\s,.;:!?])/giu,
    /(^|[\s,.;:!?])ừ(?=$|[\s,.;:!?])/giu,
    /(^|[\s,.;:!?])à(?=$|[\s,.;:!?])/giu,
  ];

  /** Loại bỏ nhẹ các từ đệm phổ biến trong transcript tiếng Việt. */
  clean(input: string): string {
    if (!input) {
      return '';
    }

    return this.fillerPatterns
      .reduce((current, pattern) => current.replace(pattern, '$1'), input)
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/([,.;:!?]){2,}/g, '$1')
      .trim();
  }
}
