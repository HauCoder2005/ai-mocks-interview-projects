import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Module quản lý dữ liệu người dùng.
 *
 * Module export UsersService để các module nghiệp vụ không truy cập trực tiếp
 * Prisma khi cần đọc hoặc cập nhật user.
 */
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
