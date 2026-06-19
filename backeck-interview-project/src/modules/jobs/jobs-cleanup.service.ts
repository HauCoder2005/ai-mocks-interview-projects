import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { JobStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../infrastructure/database/prisma.service';

/**
 * Service tự động vô hiệu hóa các tin tuyển dụng đã hết hạn.
 */
@Injectable()
export class JobsCleanupService {
  private readonly logger = new Logger(JobsCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cron job chạy lúc 00:00 hằng ngày để chuyển job hết hạn sang INACTIVE.
   *
   * @returns Promise hoàn tất sau khi cập nhật database.
   */
  @Cron('0 0 * * *')
  async disableExpiredJobs(): Promise<void> {
    try {
      const result = await this.prisma.job.updateMany({
        where: {
          status: JobStatus.ACTIVE,
          expiredAt: {
            lt: new Date(),
          },
        },
        data: {
          status: JobStatus.INACTIVE,
        },
      });

      this.logger.log(`Đã vô hiệu hóa ${result.count} tin tuyển dụng hết hạn.`);
    } catch (error) {
      this.logger.error(
        'Không thể vô hiệu hóa tin tuyển dụng hết hạn.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
