import { SetMetadata } from '@nestjs/common';

export const ROLES_METADATA_KEY = 'shared:roles';

/**
 * Khai báo danh sách vai trò được phép truy cập handler hoặc controller.
 *
 * Decorator nhận chuỗi để shared layer không phụ thuộc enum nghiệp vụ của bất kỳ
 * module nào; từng module có thể truyền enum role của riêng mình khi sử dụng.
 *
 * @param roles Danh sách vai trò hợp lệ cho endpoint.
 * @returns Metadata decorator cho guard phân quyền.
 */
export const Roles = (...roles: string[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
