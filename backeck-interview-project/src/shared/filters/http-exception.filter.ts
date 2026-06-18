import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponseBody {
  message?: string | string[];
  error?: string;
  errors?: unknown;
}

const INTERNAL_SERVER_ERROR_STATUS = 500;

/**
 * Exception filter toàn cục cho HTTP API.
 *
 * Filter gom mọi lỗi về một envelope thống nhất để client có thể dựa vào
 * `statusCode`, `message`, `data` và `meta` thay vì phụ thuộc vào shape riêng
 * của từng exception trong NestJS hoặc lỗi runtime chưa được chuẩn hóa.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly appEnv: string,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = this.resolveStatusCode(exception);
    const body = this.resolveResponseBody(exception);
    const message = this.resolveMessage(body, statusCode);
    const isInternalServerError = statusCode === INTERNAL_SERVER_ERROR_STATUS;

    if (isInternalServerError) {
      this.logger.error(
        this.resolveLogMessage(exception, request),
        this.resolveStackTrace(exception),
        HttpExceptionFilter.name,
      );
    }

    response.status(statusCode).json({
      statusCode,
      message,
      data: null,
      meta: {
        error: body.error ?? HttpStatus[statusCode] ?? 'Error',
        path: request.originalUrl ?? request.url,
        timestamp: new Date().toISOString(),
        details: this.resolveClientDetails(body, exception, statusCode),
      },
    });
  }

  private resolveStatusCode(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : INTERNAL_SERVER_ERROR_STATUS;
  }

  private resolveResponseBody(exception: unknown): ErrorResponseBody {
    if (!(exception instanceof HttpException)) {
      return {
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.',
        error: 'Internal Server Error',
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
        error: exception.name,
      };
    }

    return response;
  }

  private resolveMessage(
    body: ErrorResponseBody,
    statusCode: number,
  ): string | string[] {
    if (body.message) {
      return body.message;
    }

    return statusCode === INTERNAL_SERVER_ERROR_STATUS
      ? 'Lỗi hệ thống. Vui lòng thử lại sau.'
      : 'Yêu cầu không hợp lệ.';
  }

  private resolveClientDetails(
    body: ErrorResponseBody,
    exception: unknown,
    statusCode: number,
  ): unknown {
    if (statusCode !== INTERNAL_SERVER_ERROR_STATUS) {
      return body.errors;
    }

    if (this.appEnv !== 'development') {
      return undefined;
    }

    return {
      errors: body.errors,
      stack: this.resolveStackTrace(exception),
    };
  }

  private resolveLogMessage(exception: unknown, request: Request): string {
    const method = request.method;
    const path = request.originalUrl ?? request.url;

    if (exception instanceof Error) {
      return `${method} ${path} - ${exception.message}`;
    }

    return `${method} ${path} - Lỗi hệ thống không xác định.`;
  }

  private resolveStackTrace(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack;
    }

    return String(exception);
  }
}
