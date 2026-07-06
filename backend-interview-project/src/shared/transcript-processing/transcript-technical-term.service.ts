import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptTechnicalTermService {
  private readonly termReplacements: Array<[RegExp, string]> = [
    [/\bnest\s+js\b/giu, 'NestJS'],
    [/\bnext\s+js\b/giu, 'Next.js'],
    [/\bnode\s+js\b/giu, 'Node.js'],
    [/\bmy\s+sql\b/giu, 'MySQL'],
    [/\bpostgre\s+sql\b/giu, 'PostgreSQL'],
    [/\bpost\s+gre\s+sql\b/giu, 'PostgreSQL'],
    [/\bjava\s+script\b/giu, 'JavaScript'],
    [/\btype\s+script\b/giu, 'TypeScript'],
    [/\bdocker\s+compose\b/giu, 'Docker Compose'],
    [/\bredis\b/giu, 'Redis'],
    [/\bmin\s+io\b/giu, 'MinIO'],
    [/\bprisma\b/giu, 'Prisma'],
    [/\breact\s+js\b/giu, 'ReactJS'],
    [/\bvue\s+js\b/giu, 'Vue.js'],
  ];

  /** Chuẩn hóa nhẹ tên công nghệ thường gặp trong transcript. */
  normalize(input: string): string {
    if (!input) {
      return '';
    }

    return this.termReplacements.reduce(
      (current, [pattern, replacement]) =>
        current.replace(pattern, replacement),
      input,
    );
  }
}
