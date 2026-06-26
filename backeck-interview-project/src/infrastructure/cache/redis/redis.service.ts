import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from 'src/config/env.interface';
import { ResourceLifecycleService } from 'src/shared/abstracts/connectable/resource-lifecycle.service';

/**
 * Lớp dịch vụ quản lý kết nối và các thao tác cơ bản với Redis.
 * Kế thừa ResourceLifecycleService và triển khai các hook vòng đời của NestJS.
 */
@Injectable()
export class RedisService extends ResourceLifecycleService implements OnModuleInit, OnModuleDestroy
{
  /**
   * Cung cấp cơ chế ghi log chuẩn của NestJS cho service này.
   */
  private readonly logger = new Logger(RedisService.name);

  /**
   * Client ioredis duy trì kết nối thực tế tới Redis server.
   */
  private readonly client: Redis;

  /**
   * Thời gian sống mặc định (Time To Live - tính bằng giây) cho các khóa (key) lưu trong Redis.
   */
  private readonly redisTtl: number;

  /**
   * Khởi tạo Redis client.
   * Cấu hình được lấy thông qua ConfigService. Cờ lazyConnect được bật để
   * hoãn việc kết nối mạng thực tế cho đến khi gọi onModuleInit.
   */
  constructor(private readonly configService: ConfigService) {
    super();

    const redisConfig =
      this.configService.getOrThrow<RedisConfig>('config.redis');

    this.redisTtl = redisConfig.ttl;

    this.client = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
      lazyConnect: true,
      connectTimeout: 10_000,
      maxRetriesPerRequest: 3,
    });
  }

  /**
   * Hook vòng đời của NestJS, chạy ngay sau khi module được khởi tạo.
   * Dùng để thiết lập kết nối tới Redis và gửi lệnh PING để kiểm tra sức khỏe.
   */
  async onModuleInit(): Promise<void> {
    await this.client.connect();
    const checkConnect = await this.client.ping();
    this.logger.log(`Redis connected successfully: ${checkConnect}`);
  }

  /**
   * Hook vòng đời của NestJS, chạy trước khi ứng dụng tắt.
   * Đảm bảo đóng kết nối Redis an toàn, tránh rò rỉ bộ nhớ hoặc treo tiến trình.
   */
  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  /**
   * Lưu trữ dữ liệu dạng chuỗi vào Redis kèm theo thời gian hết hạn (TTL).
   * Trong thực tế, ví dụ khi xây dựng hệ thống nền tảng Giao (Project Shopping Now),
   * phương thức này rất hữu ích để lưu trạng thái giỏ hàng tạm thời, caching API hoặc mã OTP.
   *
   * @param key Từ khóa duy nhất định danh dữ liệu.
   * @param value Giá trị chuỗi cần lưu trữ.
   * @param ttlSeconds Thời gian sống của key (giây), mặc định lấy từ biến môi trường.
   */
  async setValue(
    key: string,
    value: string,
    ttlSeconds = this.redisTtl,
  ): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  /**
   * Truy xuất giá trị dạng chuỗi từ Redis dựa vào khóa đã cung cấp.
   * Trả về null nếu khóa không tồn tại hoặc đã hết hạn.
   *
   * @param key Từ khóa cần tìm.
   * @returns Giá trị tương ứng hoặc null.
   */
  async getValue(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Xóa một khóa khỏi bộ nhớ Redis.
   * Hữu ích khi cần thu hồi token, xóa session đã đăng xuất hoặc OTP đã sử dụng xong.
   *
   * @param key Từ khóa cần xóa.
   */
  async deleteValue(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Kiểm tra sự tồn tại của một khóa mà không tốn chi phí mạng
   * để tải toàn bộ giá trị (value) về phía NestJS server.
   *
   * @param key Từ khóa cần kiểm tra.
   * @returns True nếu khóa tồn tại, ngược lại là False.
   */
  async valueExists(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);
    return exists === 1;
  }
}
