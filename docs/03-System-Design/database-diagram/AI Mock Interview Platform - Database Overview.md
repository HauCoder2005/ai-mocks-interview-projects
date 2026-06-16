> [!abstract]  
> Tài liệu này mô tả tổng quan toàn bộ Database của hệ thống AI Mock Interview Platform.
> 
> Mục tiêu:
> 
> - Xác định các Domain trong hệ thống
> - Xác định số lượng bảng
> - Xác định mối quan hệ giữa các Domain
> - Hiểu luồng dữ liệu tổng thể trước khi đi vào chi tiết từng bảng

---

# Database Architecture

> [!info]  
> Database được chia thành các Domain độc lập để dễ quản lý, mở rộng và bảo trì.

```
Authentication Domain

Interview Domain

CV Domain

Job Domain

Voice Interview Domain

Subscription Domain
```

---

# Database Summary

## Authentication Domain

> [!success]  
> Quản lý tài khoản người dùng và phân quyền.

### Tables

```
roles

users
```

### Responsibilities

```
Đăng ký

Đăng nhập

Quản lý hồ sơ người dùng

Phân quyền hệ thống
```

---

## Interview Domain

> [!success]  
> Domain quan trọng nhất của toàn bộ hệ thống.

### Tables

```
interview_positions

interview_levels

interview_topics

interview_technologies

interview_question_banks

interview_question_bank_options

interview_configurations

interview_configuration_topics

interview_configuration_technologies

interview_sessions

interview_session_questions

interview_session_question_options

interview_answers

interview_answer_reviews

interview_reports
```

### Responsibilities

```
Quản lý dữ liệu phỏng vấn

Quản lý Question Bank

Tạo cấu hình phỏng vấn

Tổ chức Interview Session

Lưu câu trả lời

Đánh giá bằng AI

Tạo báo cáo cuối phiên
```

---

## CV Domain

> [!success]  
> Hỗ trợ xây dựng và đánh giá CV.

### Tables

```
cv_templates

user_cvs

user_cv_educations

user_cv_experiences

user_cv_projects

user_cv_skills

cv_reviews
```

### Responsibilities

```
Tạo CV

Lưu CV

Quản lý kinh nghiệm

Quản lý học vấn

Quản lý dự án

Đánh giá CV bằng AI
```

---

## Job Domain

> [!success]  
> Quản lý dữ liệu tuyển dụng và gợi ý công việc.

### Tables

```
jobs

job_skills

job_skill_mappings

user_saved_jobs

user_job_applications
```

### Responsibilities

```
Lưu dữ liệu việc làm

Mapping kỹ năng

Lưu công việc yêu thích

Theo dõi trạng thái ứng tuyển
```

---

## Voice Interview Domain

> [!success]  
> Hỗ trợ luyện phỏng vấn bằng giọng nói.

### Tables

```
voice_interview_sessions

voice_interview_messages
```

### Responsibilities

```
Lưu phiên phỏng vấn

Lưu hội thoại

Lưu dữ liệu âm thanh
```

---

## Subscription Domain

> [!warning]  
> Chưa triển khai ở giai đoạn MVP.

### Tables

```
subscription_plans

user_subscriptions
```

### Responsibilities

```
Quản lý gói dịch vụ

Quản lý quyền sử dụng
```

---

# Total Tables

```
Authentication Domain : 2

Interview Domain      : 15

CV Domain             : 7

Job Domain            : 5

Voice Domain          : 2

Subscription Domain   : 2
```

---

## Total

```
33 Tables
```

---

# High Level Relationship

```
User
│
├── Interview Domain
│
├── CV Domain
│
├── Job Domain
│
├── Voice Interview Domain
│
└── Subscription Domain
```

---

# Core Business Flow

> [!tip]  
> Luồng nghiệp vụ chính của hệ thống.

```
User
 ↓
Select Position
 ↓
Select Level
 ↓
Select Topic
 ↓
Create Interview Configuration
 ↓
Start Interview Session
 ↓
Answer Questions
 ↓
AI Evaluation
 ↓
Interview Report
 ↓
Improve CV
 ↓
Apply Job
```

---

# Next Documents

Sau tài liệu này cần đọc tiếp theo thứ tự:

```
Authentication Domain.md

Interview Master Data.md

Interview Question Bank.md

Interview Runtime.md

CV Domain.md

Job Domain.md

Voice Interview Domain.md

Subscription Domain.md
```

Các tài liệu trên sẽ giải thích chi tiết:

```
Tại sao có bảng này?

Tại sao có trường này?

Nghiệp vụ sử dụng trường này như thế nào?

Quan hệ với bảng khác ra sao?
```