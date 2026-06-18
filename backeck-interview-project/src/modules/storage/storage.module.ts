import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { StorageService } from './storage.service';

/**
 * Module lưu trữ file dùng chung cho các nghiệp vụ cần object storage.
 */
@Module({
  providers: [MinioService, StorageService],
  exports: [MinioService, StorageService],
})
export class StorageModule {}
