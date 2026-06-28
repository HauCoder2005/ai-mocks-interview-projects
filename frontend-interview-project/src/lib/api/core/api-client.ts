/*
 * api-client.ts là nơi cấu hình cách frontend giao tiếp với backend.
 *
 * File này đóng vai trò là bộ gọi API dùng chung cho toàn bộ frontend,
 * thay vì mỗi service tự viết fetch riêng lẻ.
 *
 * Nhiệm vụ chính:
 * - Cấu hình base URL hoặc proxy URL để gọi backend.
 * - Cấu hình các HTTP method dùng chung như GET, POST, PATCH, DELETE.
 * - Tự động gắn header cần thiết, ví dụ Content-Type: application/json.
 * - Gửi request từ frontend sang backend.
 * - Nhận response thành công từ backend và trả dữ liệu về service.
 * - Nhận response lỗi từ backend và chuẩn hóa lỗi để UI có thể hiển thị.
 *
 * File này sử dụng generic TResponse để service có thể khai báo rõ
 * kiểu dữ liệu mà backend sẽ trả về cho từng endpoint.
 *
 * Ví dụ:
 * - Login trả về ApiResponse<LoginResponseData>
 * - Danh sách position trả về ApiResponseWithMeta<PositionDto[]>
 *
 * Nhờ TResponse, TypeScript biết response.data có những field nào.
 * Điều này giúp service và UI dùng dữ liệu an toàn hơn, tránh gọi sai field.
 *
 * Flow xử lý:
 * UI user/admin -> service -> api-client -> backend
 * backend -> api-client -> service -> UI user/admin
 *
 * File này không render giao diện.
 * Nó chỉ chịu trách nhiệm gọi API và xử lý response/error tập trung.
 */

import { ApiErrorResponse } from "./api-error";

const urlApi = process.env.NEXT_PUBLIC_API_URL as string;
if (!urlApi) throw new Error('No search env api backend!');

export const request = async <TResponse>(path: string, option: RequestInit,): Promise<TResponse | null> => {
    const response = await fetch(`${urlApi}${path}`, {
        ...option,
        headers: {
        "Content-Type": "application/json",
        ...option.headers,
        },
    });
    const data = await response.json();
    if (!data.ok) {
        const apiErr = data as ApiErrorResponse;
        throw new Error(
            [apiErr.message].flat().filter(Boolean).join(", ") ||
            apiErr.error ||
            "API request failed",
        );
    };
    return data as TResponse;
}