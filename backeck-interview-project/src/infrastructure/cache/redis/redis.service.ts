import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from 'src/config/env.interface';
import { ResourceLifecycleService } from 'src/shared/abstracts/connectable/resource-lifecycle.service';

@Injectable()
export class RedisService extends ResourceLifecycleService {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly redisTtl: number;

  /**
   * Khởi tạo Redis client dùng chung cho các module cần cache/session tạm thời.
   */
  constructor(private readonly configService: ConfigService) {
    super();
    const redisConfig =
      this.configService.getOrThrow<RedisConfig>('config.redis');
    if (!redisConfig) {
      this.logger.error(
        'Failed to load Redis configuration from environment variables.',
      );
    }
    this.redisTtl = redisConfig?.ttl;
    this.client = new Redis({
      host: redisConfig?.host,
      port: redisConfig?.port,
      password: redisConfig?.password,
      db: redisConfig?.db,
      lazyConnect: true,
      connectTimeout: 10_000,
      maxRetriesPerRequest: 3,
    });
  }

  /**
   * Kết nối Redis khi NestJS khởi tạo module.
   */
  async onModuleInit(): Promise<void> {
    await this.client.connect();
    const checkConnect = await this.client.ping();
    this.logger.log(`Redis connected successfully:  ${checkConnect}`);
  }

  /**
   * Đóng kết nối Redis khi ứng dụng shutdown.
   */
  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  /**
   * Lưu value string vào Redis với TTL để dùng cho dữ liệu tạm thời.
   */
  async setValue(
    key: string,
    value: string,
    ttlSeconds = this.redisTtl,
  ): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  /**
   * Lấy value string từ Redis theo key.
   */
  async getValue(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Xóa key khỏi Redis khi OTP/session đã dùng xong hoặc bị revoke.
   */
  async deleteValue(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Kiểm tra key còn tồn tại trong Redis mà không cần đọc value.
   */
  async valueExists(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);

    return exists === 1;
  }
}
