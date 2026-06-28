/*
 * Chuyển input array từ JSON hoặc chuỗi form "1,2,3" thành number[].
 * Helper này giữ JSON array hoạt động bình thường và hỗ trợ Swagger form.
 */
export function toNumberArray(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => Number(item));
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return [];
    }

    return trimmedValue.split(',').map((item) => Number(item.trim()));
  }

  return value;
}
