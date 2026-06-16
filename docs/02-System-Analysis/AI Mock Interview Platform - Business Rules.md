
> [!abstract]  
> Business Rules mô tả các quy tắc nghiệp vụ, ràng buộc và chính sách vận hành mà hệ thống phải tuân thủ trong quá trình hoạt động.

---

# BR-01 Account Rules

> [!info]  
> Các quy tắc liên quan đến tài khoản và xác thực người dùng.

### BR-001

```text
Candidate phải đăng ký tài khoản trước khi sử dụng các chức năng cá nhân hóa.
```

### BR-002

```text
Candidate phải đăng nhập trước khi tạo Interview.
```

### BR-003

```text
Candidate phải đăng nhập trước khi sử dụng CV Review.
```

### BR-004

```text
Candidate phải đăng nhập trước khi tạo hoặc lưu CV.
```

### BR-005

```text
Candidate phải đăng nhập trước khi lưu Job.
```

---

# BR-02 Interview Rules

> [!success]  
> Các quy tắc liên quan đến quá trình tạo và thực hiện phỏng vấn.

### BR-006

```text
Mỗi Interview phải thuộc một Position duy nhất.
```

### BR-007

```text
Mỗi Interview phải thuộc một Experience Level duy nhất.
```

### BR-008

```text
Mỗi Interview phải có ít nhất một Technology được lựa chọn.
```

### BR-009

```text
Candidate có thể lựa chọn nhiều Focus Topics.
```

### BR-010

```text
Interview chỉ được bắt đầu khi hoàn tất toàn bộ thông tin cấu hình.
```

### BR-011

```text
Mỗi Interview phải được gắn với một Candidate duy nhất.
```

---

# BR-03 Question Generation Rules

> [!success]  
> Các quy tắc liên quan đến việc sinh câu hỏi bằng AI.

### BR-012

```text
AI phải sinh câu hỏi dựa trên Position được lựa chọn.
```

### BR-013

```text
AI phải sinh câu hỏi dựa trên Experience Level.
```

### BR-014

```text
AI phải ưu tiên các Technology được Candidate lựa chọn.
```

### BR-015

```text
AI phải ưu tiên các Focus Topics được Candidate lựa chọn.
```

### BR-016

```text
Độ khó của câu hỏi phải phù hợp với Experience Level.
```

### BR-017

```text
Bộ câu hỏi phải có tính đa dạng và hạn chế trùng lặp.
```

---

# BR-04 Answer Evaluation Rules

> [!warning]  
> Đây là nhóm quy tắc cốt lõi của toàn bộ sản phẩm.

### BR-018

```text
Mỗi câu trả lời phải được đánh giá độc lập.
```

### BR-019

```text
AI phải đưa ra điểm số cho từng câu hỏi.
```

### BR-020

```text
AI phải giải thích lý do của điểm số.
```

### BR-021

```text
AI phải chỉ ra các lỗi kiến thức nếu có.
```

### BR-022

```text
AI phải đề xuất nội dung cần cải thiện.
```

### BR-023

```text
AI không được chỉ trả về điểm số mà không có nhận xét.
```

---

# BR-05 Interview Report Rules

> [!tip]  
> Các quy tắc liên quan đến báo cáo kết quả phỏng vấn.

### BR-024

```text
Interview Report chỉ được tạo sau khi Interview hoàn thành.
```

### BR-025

```text
Mỗi Interview chỉ có một Interview Report chính thức.
```

### BR-026

```text
Report phải có Overall Score.
```

### BR-027

```text
Report phải có Strengths.
```

### BR-028

```text
Report phải có Areas For Improvement.
```

### BR-029

```text
Report phải có Improvement Recommendations.
```

### BR-030

```text
Report phải có Interview Readiness Assessment.
```

Ví dụ:

```text
Ready To Apply

Need Improvement

Not Ready
```

---

# BR-06 Interview History Rules

> [!info]  
> Các quy tắc liên quan đến lịch sử học tập và phỏng vấn.

### BR-031

```text
Mọi Interview hoàn thành phải được lưu vào lịch sử.
```

### BR-032

```text
Candidate có thể xem lại Interview đã thực hiện.
```

### BR-033

```text
Candidate có thể xem lại Report của các Interview trước đó.
```

### BR-034

```text
Candidate có thể theo dõi sự thay đổi điểm số theo thời gian.
```

---

# BR-07 CV Review Rules

> [!success]  
> Các quy tắc liên quan đến việc đánh giá CV.

### BR-035

```text
Chỉ chấp nhận CV ở định dạng PDF.
```

### BR-036

```text
Mỗi lần đánh giá CV phải sinh ra một CV Review Report.
```

### BR-037

```text
AI phải đánh giá nội dung CV.
```

### BR-038

```text
AI phải chỉ ra điểm mạnh của CV.
```

### BR-039

```text
AI phải chỉ ra điểm yếu của CV.
```

### BR-040

```text
AI phải đề xuất nội dung cải thiện cụ thể.
```

---

# BR-08 CV Builder Rules

> [!info]  
> Các quy tắc liên quan đến việc tạo CV.

### BR-041

```text
Candidate có thể tạo nhiều CV.
```

### BR-042

```text
Mỗi CV chỉ thuộc một Candidate.
```

### BR-043

```text
Candidate có thể chỉnh sửa CV đã tạo.
```

### BR-044

```text
Candidate có thể xuất CV dưới dạng PDF.
```

---

# BR-09 Job Discovery Rules

> [!success]  
> Các quy tắc liên quan đến việc tìm kiếm việc làm.

### BR-045

```text
Hệ thống chỉ hiển thị các Job hợp lệ.
```

### BR-046

```text
Job phải được phân loại theo Position.
```

### BR-047

```text
Job phải được phân loại theo Technology.
```

### BR-048

```text
Candidate có thể lưu nhiều Job.
```

### BR-049

```text
Một Job có thể được nhiều Candidate lưu.
```

---

# BR-10 Subscription Rules

> [!warning]  
> Các quy tắc liên quan đến mô hình miễn phí và trả phí trong tương lai.

### BR-050

```text
Candidate mới đăng ký mặc định thuộc Free Plan.
```

### BR-051

```text
Free Plan có thể bị giới hạn số lượng Interview trong một khoảng thời gian xác định.
```

### BR-052

```text
Free Plan có thể bị giới hạn số lượng CV Review.
```

### BR-053

```text
Premium Plan có thể được sử dụng Interview không giới hạn.
```

### BR-054

```text
Premium Plan có thể truy cập các tính năng nâng cao trong tương lai.
```

---

# BR-11 Authorization Rules

> [!warning]  
> Các quy tắc phân quyền hệ thống.

### BR-055

```text
Candidate chỉ được truy cập dữ liệu của chính mình.
```

### BR-056

```text
Candidate không được truy cập dữ liệu của Candidate khác.
```

### BR-057

```text
Platform Manager có quyền quản lý toàn bộ hệ thống.
```

### BR-058

```text
Chỉ Platform Manager mới được truy cập các chức năng quản trị.
```