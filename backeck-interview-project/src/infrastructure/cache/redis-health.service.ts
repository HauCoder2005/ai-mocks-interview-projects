import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class RedisHealthService implements OnModuleInit {
  private readonly logger = new Logger(RedisHealthService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit(): Promise<void> {
    await this.pingRedis();
  }

  private async pingRedis(): Promise<void> {
    try {
      const redisStore = this.cacheManager.store as RedisStore;
      const response = await redisStore.client.ping();

      if (response === 'PONG') {
        this.logger.log('Redis connection established successfully (PONG).');
      } else {
        this.logger.warn(
          `Redis connected, but unexpected response: ${response}`,
        );
      }
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis connection failed: ${details}`);
    }
  }
}
