import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from 'ioredis';
import { RedisConfig } from "src/config/env.interface";

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);
    private readonly client: Redis;
    private readonly redisTtl: number;

    constructor(private readonly configService: ConfigService) {
        const redisConfig = this.configService.getOrThrow<RedisConfig>('config.redis');
        // check thử xem có lấy được config env không
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
}