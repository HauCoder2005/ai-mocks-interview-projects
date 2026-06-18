import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Kiểm tra giá trị của một field phải trùng với field khác trong cùng DTO.
 *
 * Decorator này đặt ở shared vì nhiều module có thể cần xác nhận lại dữ liệu
 * nhạy cảm như mật khẩu, email mới hoặc mã PIN mà không lặp logic validator.
 *
 * @param relatedField Field nguồn dùng để so sánh.
 * @param validationOptions Tùy chọn message và nhóm validation của class-validator.
 * @returns Property decorator cho DTO.
 */
export function MatchField(
  relatedField: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyName) => {
    registerDecorator({
      name: 'MatchField',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [relatedField],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [field] = args.constraints as [string];
          const object = args.object as Record<string, unknown>;

          return value === object[field];
        },
        defaultMessage(args: ValidationArguments): string {
          const [field] = args.constraints as [string];

          return `${args.property} phải trùng với ${field}.`;
        },
      },
    });
  };
}
