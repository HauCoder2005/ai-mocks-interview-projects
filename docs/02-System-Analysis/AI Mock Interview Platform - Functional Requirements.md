# 4.2 Functional Requirements

> [!abstract]  
> Functional Requirements mô tả các chức năng mà hệ thống phải cung cấp để hỗ trợ Candidate trong quá trình chuẩn bị ứng tuyển và phát triển nghề nghiệp.

---

# FR-01 Authentication & Account Management

> [!info]  
> Hệ thống phải cho phép Candidate quản lý tài khoản cá nhân.

### Chức năng

```text
- Đăng ký tài khoản
- Đăng nhập
- Đăng xuất
- Quản lý hồ sơ cá nhân
- Cập nhật thông tin cá nhân
```

---

# FR-02 AI Mock Interview

> [!success]  
> Đây là chức năng cốt lõi của toàn bộ hệ thống.

Hệ thống phải cho phép Candidate tạo và thực hiện các phiên phỏng vấn mô phỏng.

### Thiết Lập Phiên Phỏng Vấn

```text
- Chọn vị trí ứng tuyển
- Chọn trình độ kinh nghiệm
- Chọn ngôn ngữ lập trình
- Chọn framework hoặc công nghệ
- Chọn chủ đề trọng tâm (Redis, Docker, Database...)
```

### Sinh Câu Hỏi

```text
- AI tự động tạo bộ câu hỏi phỏng vấn
- Câu hỏi phù hợp với vị trí ứng tuyển
- Câu hỏi phù hợp với trình độ ứng viên
- Câu hỏi phù hợp với công nghệ được lựa chọn
```

### Hình Thức Trả Lời

```text
1. Text Answer

- Nhập câu trả lời dạng văn bản

2. Voice Answer

- Trả lời bằng giọng nói
- Hệ thống chuyển đổi giọng nói thành văn bản
- AI đánh giá nội dung câu trả lời
```

### Coding Question

```text
- Hỗ trợ câu hỏi lập trình
- Cung cấp vùng nhập mã nguồn
- Cho phép nhập code nhiều dòng
- Hỗ trợ hiển thị định dạng code
```

### AI Evaluation

```text
- Chấm điểm câu trả lời
- Đánh giá kiến thức chuyên môn
- Đánh giá tư duy giải quyết vấn đề
- Đánh giá khả năng diễn đạt
- Phân tích điểm mạnh
- Phân tích điểm yếu
- Đề xuất nội dung cần cải thiện
```

---

# FR-03 Interview Report

> [!success]  
> Sau khi kết thúc phỏng vấn, hệ thống phải tạo báo cáo đánh giá chi tiết.

### Báo Cáo

```text
- Điểm tổng thể
- Điểm theo từng chủ đề
- Điểm mạnh
- Điểm yếu
- Nội dung cần cải thiện
- Đề xuất lộ trình học tập
- Đánh giá mức độ sẵn sàng ứng tuyển
```

---

# FR-04 Interview History & Progress Tracking

> [!tip]  
> Hệ thống phải lưu lịch sử học tập để Candidate theo dõi sự tiến bộ.

### Chức năng

```text
- Lưu lịch sử phỏng vấn
- Xem lại câu hỏi đã được hỏi
- Xem lại câu trả lời đã gửi
- Xem lại báo cáo đánh giá
- So sánh kết quả giữa các lần phỏng vấn
- Theo dõi sự thay đổi điểm số theo thời gian
- Theo dõi các kỹ năng đã cải thiện
- Theo dõi các kỹ năng còn yếu
```

---

# FR-05 Job Discovery

> [!info]  
> Hệ thống phải giúp Candidate tiếp cận các cơ hội việc làm mới nhất.

### Chức năng

```text
- Thu thập việc làm từ các nguồn tuyển dụng
- Cập nhật việc làm mới trong vòng 7 ngày gần nhất
- Phân loại việc làm theo vị trí
- Phân loại việc làm theo công nghệ
- Phân loại việc làm theo kinh nghiệm
- Phân loại việc làm theo địa điểm
```

### Tìm Kiếm

```text
- Tìm kiếm việc làm
- Lọc việc làm theo vị trí
- Lọc việc làm theo công nghệ
- Lọc việc làm theo cấp độ
- Lọc việc làm theo khu vực
```

### Quản Lý Việc Làm

```text
- Xem chi tiết việc làm
- Lưu việc làm quan tâm
- Xem danh sách việc làm đã lưu
```

---

# FR-06 AI CV Review

> [!success]  
> Hệ thống phải sử dụng AI để đánh giá chất lượng CV.

### Chức năng

```text
- Tải CV lên hệ thống
- Đọc nội dung CV
- Phân tích nội dung CV
- Chấm điểm CV
- Phân tích điểm mạnh
- Phân tích điểm yếu
- Đề xuất nội dung cần cải thiện
- Đề xuất ATS Keywords
```

### Kết Quả

```text
- CV Score
- Strengths
- Weaknesses
- Improvement Suggestions
```

---

# FR-07 CV Builder

> [!info]  
> Hệ thống phải hỗ trợ Candidate tạo CV nhanh chóng.

### Chức năng

```text
- Chọn template CV
- Nhập thông tin cá nhân
- Nhập kinh nghiệm làm việc
- Nhập kỹ năng
- Nhập dự án
- Tạo CV tự động
- Chỉnh sửa CV
- Lưu CV
- Xuất PDF
```

---

# FR-08 Platform Management

> [!warning]  
> Hệ thống phải cung cấp các chức năng quản trị nền tảng.

### Chức năng

```text
- Quản lý Candidate
- Quản lý CV Templates
- Quản lý nguồn dữ liệu việc làm
- Theo dõi hoạt động hệ thống
- Xem thống kê sử dụng
- Giám sát chất lượng dịch vụ
```