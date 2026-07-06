import { TranscriptFillerWordService } from './transcript-filler-word.service';
import { TranscriptNormalizationService } from './transcript-normalization.service';
import { TranscriptTechnicalTermService } from './transcript-technical-term.service';

describe('TranscriptNormalizationService', () => {
  let service: TranscriptNormalizationService;

  beforeEach(() => {
    service = new TranscriptNormalizationService(
      new TranscriptFillerWordService(),
      new TranscriptTechnicalTermService(),
    );
  });

  it('returns empty string for null, undefined, and empty input', () => {
    expect(service.normalize(null)).toBe('');
    expect(service.normalize(undefined)).toBe('');
    expect(service.normalize('   ')).toBe('');
  });

  it('collapses repeated spaces', () => {
    expect(service.normalize('Tôi   dùng     NestJS')).toBe('Tôi dùng NestJS');
  });

  it('normalizes repeated punctuation lightly', () => {
    expect(service.normalize('Tôi dùng node js!!! Ổn chứ??')).toBe(
      'Tôi dùng Node.js! Ổn chứ?',
    );
  });

  it('reduces common Vietnamese filler words', () => {
    expect(service.normalize('ờ tôi ừm dùng redis, kiểu như cache')).toBe(
      'tôi dùng Redis, cache',
    );
  });

  it('normalizes common technical terms', () => {
    expect(
      service.normalize(
        'nest js, next js, my sql, post gre sql, type script, min io',
      ),
    ).toBe('NestJS, Next.js, MySQL, PostgreSQL, TypeScript, MinIO');
  });

  it('keeps Vietnamese diacritics', () => {
    expect(service.normalize('Tôi xử lý tiếng Việt có dấu')).toBe(
      'Tôi xử lý tiếng Việt có dấu',
    );
  });

  it('does not remove the main meaning', () => {
    expect(
      service.normalize('nói chung là tôi dùng docker compose để chạy Redis'),
    ).toBe('tôi dùng Docker Compose để chạy Redis');
  });
});
