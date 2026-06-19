import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../infrastructure/database/prisma.service';

interface CrawledJob {
  title: string;
  company: string;
  sourceUrl: string;
  expiredAt?: Date;
}

/**
 * Service tự động cào dữ liệu việc làm từ các nguồn tuyển dụng.
 *
 * Service chỉ chịu trách nhiệm tải HTML, bóc tách DOM và đồng bộ dữ liệu job
 * vào database. Lỗi mạng hoặc lỗi parse được ghi log và không làm crash app.
 */
@Injectable()
export class JobsCrawlerService {
  private readonly logger = new Logger(JobsCrawlerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Cron job chạy mỗi 6 tiếng để đồng bộ tin tuyển dụng mới nhất.
   *
   * @returns Promise hoàn tất sau khi xử lý toàn bộ URL nguồn.
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async fetchJobs(): Promise<void> {
    const sourceUrls = this.getCrawlerSourceUrls();

    if (!sourceUrls.length) {
      this.logger.warn('Không có URL nguồn tuyển dụng để crawl.');
      return;
    }

    for (const sourceUrl of sourceUrls) {
      await this.fetchJobsFromSource(sourceUrl);
    }
  }

  private async fetchJobsFromSource(sourceUrl: string): Promise<void> {
    try {
      const response = await axios.get<string>(sourceUrl, {
        timeout: 10_000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; AI-Mock-Interview-Crawler/1.0)',
        },
      });
      const jobs = this.extractJobsFromHtml(response.data, sourceUrl);

      for (const job of jobs) {
        await this.upsertJob(job);
      }

      this.logger.log(
        `Đã crawl ${jobs.length} tin tuyển dụng từ nguồn ${sourceUrl}.`,
      );
    } catch (error) {
      this.logger.error(
        `Không thể crawl tin tuyển dụng từ nguồn ${sourceUrl}.`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private extractJobsFromHtml(html: string, baseUrl: string): CrawledJob[] {
    const $ = cheerio.load(html);
    const jobs: CrawledJob[] = [];
    const candidates = $('.job, .job-item, .job-card, article, li')
      .toArray()
      .slice(0, 100);

    for (const element of candidates) {
      const container = $(element);
      const title = this.normalizeText(
        container.find('.title, .job-title, h2, h3, a').first().text(),
      );
      const company = this.normalizeText(
        container
          .find('.company, .company-name, [data-company]')
          .first()
          .text(),
      );
      const href = container.find('a[href]').first().attr('href');
      const sourceUrl = this.resolveSourceUrl(href, baseUrl);
      const expiredAt = this.parseExpiredAt(container.text());

      if (!title || !company || !sourceUrl) {
        continue;
      }

      jobs.push({
        title,
        company,
        sourceUrl,
        expiredAt,
      });
    }

    return this.deduplicateJobs(jobs);
  }

  private async upsertJob(job: CrawledJob): Promise<void> {
    try {
      await this.prisma.job.upsert({
        where: {
          sourceUrl: job.sourceUrl,
        },
        create: {
          title: job.title,
          company: job.company,
          sourceUrl: job.sourceUrl,
          expiredAt: job.expiredAt,
          status: JobStatus.ACTIVE,
        },
        update: {
          title: job.title,
          company: job.company,
          expiredAt: job.expiredAt,
          status: JobStatus.ACTIVE,
        },
      });
    } catch (error) {
      this.logger.error(
        `Không thể lưu job sourceUrl=${job.sourceUrl}.`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private getCrawlerSourceUrls(): string[] {
    return (
      this.configService
        .get<string>('JOBS_CRAWLER_URLS')
        ?.split(',')
        .map((url) => url.trim())
        .filter(Boolean) ?? []
    );
  }

  private parseExpiredAt(rawText: string): Date | undefined {
    const text = this.normalizeText(rawText);
    const datePatterns = [
      /(?:hạn nộp|hết hạn|deadline|expires?)\D*(\d{1,2})[/-](\d{1,2})[/-](\d{4})/i,
      /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/i,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);

      if (!match) {
        continue;
      }

      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      const expiredAt = new Date(year, month - 1, day, 23, 59, 59);

      if (!Number.isNaN(expiredAt.getTime())) {
        return expiredAt;
      }
    }

    const relativeMatch = text.match(
      /(?:còn|expires in)\s+(\d+)\s+(?:ngày|days?)/i,
    );

    if (!relativeMatch) {
      return undefined;
    }

    const days = Number(relativeMatch[1]);
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + days);
    expiredAt.setHours(23, 59, 59, 999);

    return expiredAt;
  }

  private resolveSourceUrl(href: string | undefined, baseUrl: string): string {
    if (!href) {
      return '';
    }

    try {
      return new URL(href, baseUrl).toString();
    } catch {
      return '';
    }
  }

  private deduplicateJobs(jobs: CrawledJob[]): CrawledJob[] {
    const seenSourceUrls = new Set<string>();

    return jobs.filter((job) => {
      if (seenSourceUrls.has(job.sourceUrl)) {
        return false;
      }

      seenSourceUrls.add(job.sourceUrl);
      return true;
    });
  }

  private normalizeText(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
