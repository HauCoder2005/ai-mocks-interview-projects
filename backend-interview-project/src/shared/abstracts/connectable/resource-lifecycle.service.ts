import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
/*
   Abstract
    Bắt buộc class con phải tự xử lý logic, chạy thông báo
    ra terminal nhé.
   Ví dụ:
   - RedisService: connect Redis và ping thử.
   - MinioService: kiểm tra bucket tồn tại chưa.
   - QueueService: connect tới queue server.
   */
export abstract class ResourceLifecycleService
  implements OnModuleInit, OnModuleDestroy
{
  abstract onModuleInit(): Promise<void>;
  async onModuleDestroy(): Promise<void> {}
}
