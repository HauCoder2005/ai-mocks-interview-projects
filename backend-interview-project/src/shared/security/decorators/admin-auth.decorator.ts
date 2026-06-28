import { applyDecorators, UseGuards } from '@nestjs/common';

import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';

import { AdminRoleGuard } from '../guards/admin-role.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';

/*
 * Decorator dùng chung cho toàn bộ API Admin.
 * Gồm xác thực access token, kiểm tra role admin và cấu hình Swagger auth.
 */
export function AdminAuth() {
  return applyDecorators(
    UseGuards(JwtAccessGuard, AdminRoleGuard),
    ApiAuth(),
  );
}