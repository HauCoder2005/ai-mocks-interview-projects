# Kiến trúc Auth Module

## 1. Cấu trúc thư mục

```text
src/
├── shared/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   ├── index.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   ├── interfaces/
│   │   ├── api-response.interface.ts
│   │   ├── index.ts
│   │   ├── page.dto.ts
│   │   ├── page-meta.dto.ts
│   │   └── page-options.dto.ts
│   ├── pipes/
│   │   └── global-validation.pipe.ts
│   └── validators/
│       ├── index.ts
│       └── match-field.validator.ts
└── modules/
    └── auth/
        ├── dto/
        │   ├── login.dto.ts
        │   ├── register.dto.ts
        │   ├── transformers.ts
        │   └── verify-email.dto.ts
        ├── enums/
        │   ├── app-role.enum.ts
        │   └── auth-token-type.enum.ts
        ├── guards/
        │   ├── google-auth.guard.ts
        │   ├── jwt-auth.guard.ts
        │   └── roles.guard.ts
        ├── interfaces/
        ├── strategies/
        │   ├── google.strategy.ts
        │   └── jwt.strategy.ts
        ├── auth.constants.ts
        ├── auth.controller.ts
        ├── auth.module.ts
        └── auth.service.ts
```

`src/shared` giữ các cơ chế hạ tầng dùng chung như standard response, pagination, validation, exception filter, guard và validator. `src/modules/auth` chỉ chứa nghiệp vụ xác thực, phát hành token, tích hợp Google OAuth và điều phối Redis/Prisma.

## 2. Thư viện sử dụng

- `class-validator`, `class-transformer`: validate DTO ở biên HTTP, loại bỏ field ngoài hợp đồng và transform dữ liệu đầu vào.
- `@nestjs/passport`, `passport`, `passport-jwt`: chuẩn hóa luồng xác thực JWT bằng strategy/guard của Passport.
- `@nestjs/jwt`: ký và xác minh access token, refresh token với TTL riêng.
- `bcrypt`: hash mật khẩu, OTP và refresh token trước khi lưu trữ.
- `cache-manager`, `cache-manager-redis-yet`, `@nestjs/cache-manager`: lưu OTP và refresh token hash trên Redis với TTL ngắn hạn.
- `passport-google-oauth20`: tích hợp Google OAuth 2.0 để auto-login hoặc auto-register.
- `cookie-parser`: đọc refresh token từ HttpOnly cookie ở endpoint refresh.
- `@prisma/client`, `@prisma/adapter-mariadb`: thao tác bảng `users` và `roles` qua Prisma.

## 3. Luồng xác thực

### Register

Client gửi `RegisterDto` gồm email, mật khẩu, xác nhận mật khẩu và họ tên. Global validation pipe bật `whitelist`, `forbidNonWhitelisted` và `transform` để giữ request đúng hợp đồng DTO; `MatchField` bảo đảm mật khẩu xác nhận trùng với mật khẩu chính. Service kiểm tra trùng email, hash mật khẩu bằng bcrypt, tạo user với `is_verified = false`, sinh OTP 6 số, hash OTP và lưu Redis theo key `otp:verify:{userId}` trong 5 phút.

### Verify OTP

Client gửi email và OTP. Service lấy user chưa xác minh, đọc OTP hash từ Redis, so sánh bằng bcrypt. Nếu hợp lệ, user được cập nhật `is_verified = true` và key OTP bị xóa để OTP không thể tái sử dụng.

### Local Login

Service chỉ cho đăng nhập khi email tồn tại, tài khoản đã xác minh và mật khẩu khớp bcrypt hash. Hệ thống phát access token hạn 15 phút và refresh token hạn 7 ngày. Access token trả qua JSON; refresh token được set vào cookie `HttpOnly`, `Secure`, `SameSite=Strict`.

### Google OAuth 2.0

Google strategy lấy email từ provider. Nếu user đã tồn tại thì login trực tiếp và tự xác minh user cũ chưa verify. Nếu chưa tồn tại, hệ thống tạo user mới với `is_verified = true`. Sau đó token nội bộ được phát hành giống luồng local login.

### Refresh Token

Endpoint refresh đọc refresh token từ cookie, verify chữ ký JWT bằng refresh secret, lấy hash trong Redis theo key `refresh:{userId}` và so sánh bằng bcrypt. Khi token hợp lệ, hệ thống rotate refresh token: ghi hash token mới vào Redis và set lại cookie mới.

### Logout

Logout xóa Redis key `refresh:{userId}` và clear refresh cookie. Access token cũ sẽ tự hết hạn theo TTL ngắn 15 phút.

## 4. Cơ chế bảo mật cốt lõi

Hash refresh token trên Redis giúp giảm rủi ro khi Redis bị lộ dữ liệu: attacker không có refresh token gốc để gọi endpoint refresh. Redis TTL đồng bộ với thời hạn refresh token, nhờ đó phiên đăng nhập tự hết hạn mà không cần cron job dọn dẹp.

HttpOnly cookie ngăn JavaScript phía trình duyệt đọc refresh token, giảm tác động của XSS. `Secure` buộc cookie chỉ gửi qua HTTPS, còn `SameSite=Strict` giảm nguy cơ CSRF khi request đến từ site khác.

Refresh token rotation làm mỗi lần refresh chỉ còn một token hợp lệ mới nhất. Nếu refresh token cũ bị dùng lại hoặc không khớp hash Redis, hệ thống xóa key phiên để chặn tiếp tục khai thác.

OTP được hash trước khi lưu Redis vì OTP có entropy thấp và chỉ nên tồn tại ngắn hạn. TTL 5 phút giới hạn thời gian brute-force, còn xóa key sau khi xác minh bảo đảm OTP dùng một lần.

Global response interceptor chuẩn hóa mọi response thành `{ statusCode, message, data, meta? }`. Service vì vậy không cần biết shape HTTP envelope và chỉ tập trung trả dữ liệu nghiệp vụ.

Global exception filter chuẩn hóa lỗi 401, 403, 404, 500 và lỗi validation về cùng envelope JSON: `{ statusCode, message, data: null, meta }`. Frontend có thể xử lý nhất quán theo `statusCode`, `message`, `data` và đọc chi tiết kỹ thuật trong `meta`.

Bộ `PageOptionsDto`, `PageMetaDto` và `PageDto` được đặt trong shared để các module sau này tái sử dụng cùng quy ước phân trang. Khi service trả `PageDto`, response interceptor sẽ giữ danh sách trong `data` và đưa thông tin phân trang lên `meta`.
