import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/*
 * Document lỗi Bad Request dùng chung cho các API validate input.
 */
export function ApiBadRequestErrorResponse(message = 'Bad request') {
  return applyDecorators(
    ApiBadRequestResponse({
      description: message,
      schema: buildErrorSchema(400, message),
    }),
  );
}

/*
 * Document lỗi Unauthorized dùng chung cho các API cần đăng nhập.
 */
export function ApiUnauthorizedErrorResponse(message = 'Unauthorized') {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: message,
      schema: buildErrorSchema(401, message),
    }),
  );
}

/*
 * Document lỗi Not Found dùng chung khi resource không tồn tại.
 */
export function ApiNotFoundErrorResponse(message = 'Resource not found') {
  return applyDecorators(
    ApiNotFoundResponse({
      description: message,
      schema: buildErrorSchema(404, message),
    }),
  );
}

/*
 * Document lỗi Conflict dùng chung khi dữ liệu unique bị trùng.
 */
export function ApiConflictErrorResponse(message = 'Resource already exists') {
  return applyDecorators(
    ApiConflictResponse({
      description: message,
      schema: buildErrorSchema(409, message),
    }),
  );
}

/*
 * Build schema lỗi cơ bản theo response lỗi mặc định của NestJS.
 */
function buildErrorSchema(statusCode: number, message: string) {
  return {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: statusCode },
      message: { example: message },
      error: { type: 'string', example: message },
    },
  };
}
