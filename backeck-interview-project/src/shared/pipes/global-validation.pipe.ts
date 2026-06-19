import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export interface ValidationErrorItem {
  field: string;
  message: string;
}

/**
 * Pipe validation dùng chung cho toàn bộ biên HTTP.
 *
 * Lớp này cố định chính sách nhận dữ liệu đầu vào: chỉ nhận field đã khai báo
 * trong DTO, tự transform kiểu dữ liệu theo metadata và trả lỗi theo cấu trúc
 * ổn định để Frontend không phải xử lý nhiều biến thể từ class-validator.
 */
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          message: 'Dữ liệu đầu vào không hợp lệ.',
          errors: GlobalValidationPipe.formatErrors(errors),
        }),
    });
  }

  /**
   * Chuẩn hóa cây lỗi lồng nhau của class-validator thành danh sách phẳng.
   *
   * @param errors Danh sách lỗi gốc từ class-validator.
   * @returns Danh sách lỗi theo field dot-notation và message đầu tiên.
   */
  static formatErrors(errors: ValidationError[]): ValidationErrorItem[] {
    return errors.flatMap((error) => this.flattenError(error));
  }

  private static flattenError(
    error: ValidationError,
    parentPath = '',
  ): ValidationErrorItem[] {
    const fieldPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const ownErrors = Object.values(error.constraints ?? {}).map((message) => ({
      field: fieldPath,
      message,
    }));
    const childErrors =
      error.children?.flatMap((child) => this.flattenError(child, fieldPath)) ??
      [];

    return [...ownErrors, ...childErrors];
  }
}
