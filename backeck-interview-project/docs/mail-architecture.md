# Kiến trúc gửi OTP qua Transactional Email API

## Mục tiêu

Luồng đăng ký cần phát hành OTP nhanh, lưu hash OTP vào Redis và trả phản hồi cho client mà không bị chặn bởi tác vụ gửi email. Hệ thống sử dụng Transactional Email API thông qua SDK `resend` để giảm độ trễ so với SMTP truyền thống.

## Thư viện sử dụng

Dự án sử dụng thư viện `resend` làm SDK tích hợp với Resend Transactional Email API.

`MailService` khởi tạo một instance `Resend` bằng biến môi trường `RESEND_API_KEY` và gửi email từ địa chỉ cấu hình bởi `MAIL_FROM`. Với môi trường thử nghiệm của Resend, có thể dùng giá trị `onboarding@resend.dev`.

## Vì sao dùng Transactional Email API thay vì SMTP

SMTP phù hợp cho hạ tầng email truyền thống, nhưng thường tạo thêm độ trễ trong luồng request vì phải đi qua nhiều bước ở tầng kết nối và giao thức:

- Thiết lập kết nối TCP đến SMTP server.
- Thực hiện TLS handshake nếu dùng kết nối bảo mật.
- Trao đổi lệnh SMTP tuần tự như `EHLO`, `AUTH`, `MAIL FROM`, `RCPT TO`, `DATA`.
- Chờ SMTP server xác nhận từng bước trước khi request có thể hoàn tất nếu triển khai đồng bộ.

Với Transactional Email API, ứng dụng gửi một HTTP request đến provider đã tối ưu sẵn cho email giao dịch. Provider chịu trách nhiệm xử lý hàng đợi, uy tín IP, retry và giao tiếp SMTP ở tầng hạ tầng của họ. Điều này giúp luồng Authentication giảm thời gian chờ và đơn giản hóa vận hành.

## Cơ chế Fire-and-Forget trong AuthService

Trong `AuthService.register`, hệ thống vẫn `await` các bước bắt buộc để bảo đảm tính đúng đắn:

- Kiểm tra email đã tồn tại.
- Hash mật khẩu.
- Tạo user ở trạng thái chưa xác minh.
- Sinh OTP, hash OTP và lưu vào Redis với TTL ngắn hạn.

Sau khi OTP đã được lưu vào Redis, `AuthService` gọi:

```ts
void this.mailService.sendOtpEmail(email, otp);
```

Lời gọi này không dùng `await`. Vì vậy API Register không chờ Resend trả kết quả gửi email, mà trả response thành công ngay sau khi đã hoàn tất phần dữ liệu cốt lõi. Tác vụ gửi email được giao cho event loop xử lý bất đồng bộ.

Để cơ chế này an toàn, `MailService.sendOtpEmail` tự bọc lệnh gọi `resend.emails.send(...)` trong `try/catch`. Khi Resend lỗi hoặc network lỗi, service chỉ log bằng `Logger` của NestJS và không ném lỗi ra ngoài. Nhờ đó lỗi gửi email không làm crash tiến trình chính và không làm chậm response của API Register.

## Biến môi trường

```env
RESEND_API_KEY=CHANGE_ME_RESEND_API_KEY
MAIL_FROM=onboarding@resend.dev
```
