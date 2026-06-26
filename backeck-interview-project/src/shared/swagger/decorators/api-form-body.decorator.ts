import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

/*
 * Cấu hình Swagger hiển thị request body dạng form input.
 * Dùng cho API POST/PATCH để test nhanh mà không cần nhập raw JSON thủ công.
 */
export function ApiFormBody(dtoClass: Type<unknown>) {
  return applyDecorators(
    ApiConsumes('application/x-www-form-urlencoded'),
    ApiBody({ type: dtoClass }),
  );
}
