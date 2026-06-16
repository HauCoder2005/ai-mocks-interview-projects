
> [!abstract]  
> Actor là các đối tượng tương tác trực tiếp với hệ thống để đạt được mục tiêu của mình.
> 
> Trong phạm vi MVP, hệ thống AI Interview Assistant có hai actor chính:
> 
> ```text
> 1. Candidate
> 2. Platform Manager
> ```

---

# Candidate

> [!success]  
> Candidate là khách hàng chính của hệ thống và là đối tượng tạo ra giá trị cốt lõi cho sản phẩm.

## Mô Tả

Candidate là những người đang chuẩn bị tham gia thị trường lao động trong lĩnh vực Công nghệ Thông tin và mong muốn nâng cao khả năng ứng tuyển trước khi tham gia các buổi phỏng vấn thực tế.

> [!info]  
> Đối tượng này thường thiếu kinh nghiệm phỏng vấn, chưa biết điểm mạnh điểm yếu của bản thân và cần một công cụ hỗ trợ đánh giá năng lực trước khi ứng tuyển.

---

## Đối Tượng

```text
- Sinh viên CNTT
- Sinh viên năm cuối
- Thực tập sinh (Intern)
- Fresher Developer
- Junior Developer
- Người tự học lập trình
- Người chuyển ngành sang IT
```

---

## Mục Tiêu

> [!tip]  
> Candidate sử dụng hệ thống để chuẩn bị tốt hơn cho quá trình ứng tuyển.

```text
- Đánh giá mức độ sẵn sàng ứng tuyển
- Luyện tập phỏng vấn
- Cải thiện kỹ năng chuyên môn
- Tối ưu CV
- Tìm kiếm cơ hội việc làm
- Theo dõi tiến độ phát triển cá nhân
```

---

## Chức Năng Chính

### Account Management

> [!info]  
> Quản lý thông tin và hồ sơ cá nhân.

```text
- Đăng ký tài khoản
- Đăng nhập
- Đăng xuất
- Quản lý hồ sơ cá nhân
- Cập nhật thông tin cá nhân
```

### AI Mock Interview

> [!success]  
> Chức năng cốt lõi của toàn bộ hệ thống.

```text
- Tạo phiên phỏng vấn
- Chọn vị trí ứng tuyển
- Chọn trình độ
- Chọn công nghệ
- Chọn chủ đề trọng tâm
- Thực hiện phỏng vấn
- Trả lời câu hỏi
- Nhận đánh giá từ AI
```

### Interview Report

> [!success]  
> Kết quả đánh giá sau khi hoàn thành phỏng vấn.

```text
- Xem điểm tổng thể
- Xem điểm mạnh
- Xem điểm yếu
- Xem đề xuất cải thiện
- Xem mức độ sẵn sàng ứng tuyển
```

### Interview History

> [!note]  
> Toàn bộ lịch sử phỏng vấn được lưu lại để theo dõi sự tiến bộ theo thời gian.

```text
- Xem danh sách các phiên phỏng vấn
- Xem chi tiết từng phiên
- Xem lại câu hỏi
- Xem lại câu trả lời
- Xem lại kết quả đánh giá
- So sánh kết quả giữa các lần phỏng vấn
```

### Progress Tracking

> [!tip]  
> Giúp Candidate nhận biết sự phát triển của bản thân qua từng giai đoạn.

```text
- Theo dõi điểm số theo thời gian
- Theo dõi kỹ năng đã cải thiện
- Theo dõi kỹ năng còn yếu
- Xem các chủ đề cần học tiếp
- Nhận đề xuất lộ trình học tập
```

### CV Review

> [!success]  
> AI phân tích và đánh giá chất lượng CV.

```text
- Tải CV lên hệ thống
- Nhận đánh giá từ AI
- Xem điểm CV
- Xem điểm mạnh
- Xem điểm yếu
- Nhận đề xuất cải thiện
- Xem lịch sử đánh giá CV
```

### CV Builder

> [!info]  
> Công cụ hỗ trợ tạo CV theo chuẩn ATS.

```text
- Chọn mẫu CV
- Tạo CV mới
- Chỉnh sửa CV
- Lưu CV
- Quản lý CV
- Xuất PDF
```

### Job Discovery

> [!success]  
> Hỗ trợ tìm kiếm việc làm phù hợp với năng lực hiện tại.

```text
- Xem việc làm mới nhất
- Tìm kiếm việc làm
- Lọc việc làm
- Xem chi tiết việc làm
- Lưu việc làm quan tâm
```

---

# Platform Manager

> [!warning]  
> Platform Manager chịu trách nhiệm vận hành và quản lý toàn bộ nền tảng.

## Mô Tả

Platform Manager là người quản lý hệ thống, dữ liệu và chất lượng dịch vụ.

Trong giai đoạn MVP, Platform Manager chính là người sáng lập và vận hành sản phẩm.

---

## Mục Tiêu

```text
- Đảm bảo hệ thống hoạt động ổn định
- Quản lý dữ liệu nền tảng
- Quản lý nội dung hệ thống
- Theo dõi mức độ sử dụng sản phẩm
- Cải thiện trải nghiệm người dùng
```

---

## Chức Năng Chính

### Candidate Management

```text
- Xem danh sách người dùng
- Xem thông tin người dùng
- Kích hoạt tài khoản
- Vô hiệu hóa tài khoản
- Theo dõi hoạt động người dùng
```

### CV Template Management

```text
- Tạo template CV
- Chỉnh sửa template CV
- Xóa template CV
- Quản lý thư viện template
```

### Job Source Management

```text
- Quản lý nguồn dữ liệu việc làm
- Theo dõi dữ liệu tuyển dụng
- Kiểm tra chất lượng dữ liệu việc làm
```

### Analytics & Monitoring

```text
- Xem thống kê người dùng
- Xem thống kê phỏng vấn
- Xem thống kê CV Review
- Xem thống kê việc làm
- Theo dõi hiệu suất hệ thống
- Giám sát hoạt động nền tảng
```

---

> [!warning]  
> PostgreSQL, Redis, MinIO, Ollama và Llama 3 không phải là Actor.
> 
> Đây là các thành phần kỹ thuật nội bộ và sẽ được mô tả trong phần Architecture Design.