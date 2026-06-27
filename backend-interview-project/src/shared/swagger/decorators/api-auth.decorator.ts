import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

/*
 * Gắn Bearer Auth schema cho các API cần access token.
 */
export function ApiAuth() {
  return applyDecorators(ApiBearerAuth('access-token'));
}
