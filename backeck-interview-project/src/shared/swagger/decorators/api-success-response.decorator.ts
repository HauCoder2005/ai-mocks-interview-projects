import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

/*
 * Tạo schema response thành công dạng single object theo ApiResponse hiện tại.
 */
export function ApiSuccessResponse(
  dtoClass: Type<unknown> | null,
  message = 'Request successfully',
) {
  return applyDecorators(
    ...(dtoClass ? [ApiExtraModels(dtoClass)] : []),
    ApiOkResponse({
      description: message,
      schema: buildSingleResponseSchema(200, message, dtoClass),
    }),
  );
}

/*
 * Tạo schema response created dạng single object theo ApiResponse hiện tại.
 */
export function ApiCreatedSuccessResponse(
  dtoClass: Type<unknown> | null,
  message = 'Resource created successfully',
) {
  return applyDecorators(
    ...(dtoClass ? [ApiExtraModels(dtoClass)] : []),
    ApiCreatedResponse({
      description: message,
      schema: buildSingleResponseSchema(201, message, dtoClass),
    }),
  );
}

/*
 * Tạo schema response list có data và meta ở top-level.
 */
export function ApiListSuccessResponse(
  dtoClass: Type<unknown>,
  message = 'Resources retrieved successfully',
) {
  return applyDecorators(
    ApiExtraModels(dtoClass),
    ApiOkResponse({
      description: message,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: message },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dtoClass) },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 0 },
              itemCount: { type: 'number', example: 0 },
            },
          },
        },
      },
    }),
  );
}

/*
 * Build schema single response để tái sử dụng cho OK và Created.
 */
function buildSingleResponseSchema(
  statusCode: number,
  message: string,
  dtoClass: Type<unknown> | null,
) {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      statusCode: { type: 'number', example: statusCode },
      message: { type: 'string', example: message },
      data: dtoClass
        ? { $ref: getSchemaPath(dtoClass) }
        : { nullable: true, example: null },
    },
  };
}
