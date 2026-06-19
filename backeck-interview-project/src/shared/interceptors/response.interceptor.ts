import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable, map } from 'rxjs';
import type { ApiResponse } from '../interfaces/api-response.interface';

interface NormalizedResponsePayload<TData = unknown> {
  message: string;
  data: TData;
  meta?: unknown;
}

/**
 * Interceptor chuẩn hóa mọi response thành envelope API thống nhất.
 *
 * Interceptor được đặt ở shared để business service chỉ trả dữ liệu nghiệp vụ,
 * còn quyết định shape HTTP response được gom tại một lớp hạ tầng duy nhất.
 */
@Injectable()
export class ResponseInterceptor<TData> implements NestInterceptor<
  TData,
  ApiResponse<unknown>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<TData>,
  ): Observable<ApiResponse<unknown>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((payload) => {
        const normalizedPayload = this.normalizePayload(payload);

        return {
          statusCode: response.statusCode,
          message: normalizedPayload.message,
          data: normalizedPayload.data,
          ...(normalizedPayload.meta !== undefined
            ? { meta: normalizedPayload.meta }
            : {}),
        };
      }),
    );
  }

  private normalizePayload(payload: TData): NormalizedResponsePayload<unknown> {
    if (!this.isObjectRecord(payload)) {
      return {
        message: 'Thành công.',
        data: payload ?? null,
      };
    }

    const message =
      typeof payload.message === 'string' ? payload.message : 'Thành công.';
    const meta = 'meta' in payload ? payload.meta : undefined;

    if ('data' in payload) {
      return {
        message,
        data: payload.data,
        meta,
      };
    }

    if (Object.keys(payload).length === 1 && 'message' in payload) {
      return {
        message,
        data: null,
      };
    }

    return {
      message,
      data: payload,
      meta,
    };
  }

  private isObjectRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
