import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

export abstract class ResourceLifecycleService
  implements OnModuleInit, OnModuleDestroy
{
  /*
   ## abstract
    Bắt buộc class con phải tự xử lý logic khởi tạo tài nguyên.
   Ví dụ:
   - RedisService: connect Redis và ping thử.
   - MinioService: kiểm tra bucket tồn tại chưa.
   - QueueService: connect tới queue server.
   */
  abstract onModuleInit(): Promise<void>;

  async onModuleDestroy(): Promise<void> {}
}
