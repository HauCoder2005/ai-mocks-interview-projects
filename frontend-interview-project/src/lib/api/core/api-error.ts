/*
 * Mô tả lỗi validation chi tiết theo từng field trong form.
 * Ví dụ lỗi thuộc field email, password, name hoặc otp.
 * Frontend dựa vào field để hiển thị lỗi đúng dưới input tương ứng.
 */
export interface ApiFieldError {
  field: string;
  message: string;
}

/*
 * Frontend không tự biết backend sẽ trả lỗi theo cấu trúc nào.
 * Vì vậy cần định nghĩa interface này để frontend hiểu được
 * response lỗi mà backend có thể trả về.
 */
export interface ApiErrorResponse {
  success?: boolean;
  statusCode?: number;
  message?: string | string[];
  error?: string;
  errors?: ApiFieldError[];
}