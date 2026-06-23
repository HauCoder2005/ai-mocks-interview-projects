import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from 'ioredis';
import { RedisConfig } from "src/config/env.interface";
import { ResourceLifecycleService } from "src/shared/abstracts/connectable/resource-lifecycle.service";

@Injectable()
export class RedisService extends ResourceLifecycleService {
    private readonly logger = new Logger(RedisService.name);
    private readonly client: Redis;
    private readonly redisTtl: number;

    constructor(private readonly configService: ConfigService) {
        /*
            Tạo phần ResourceLifecycleService trước đã,
            sau đó mới cho RedisService dùng this.
            mục đích trỏ, gọi tới contructor của cha 
        */
        super()
        const redisConfig = this.configService.getOrThrow<RedisConfig>('config.redis');
        if(!redisConfig) {
            this.logger.error('Failed to load Redis configuration from environment variables.');
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
        })
    }

    async onModuleInit(): Promise<void> {
        await this.client.connect();
        const checkConnect = await this.client.ping();
        this.logger.log(`Redis connected successfully:  ${checkConnect}`);
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.quit();
        this.logger.log('Redis disconnected');
    }
}