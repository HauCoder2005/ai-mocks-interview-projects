import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Gắn danh sách roleId được phép truy cập endpoint.
 */
export const Roles = (...roleIds: number[]) => SetMetadata(ROLES_KEY, roleIds);
