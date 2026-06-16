> [!abstract]  
> Domain Relationship Analysis nhằm xác định mối quan hệ giữa các thực thể nghiệp vụ trong hệ thống.
> 
> Tài liệu này trả lời:
> 
> - Entity nào liên kết với Entity nào?
>     
> - Tại sao cần liên kết?
>     
> - Cardinality là gì?
>     
> - Luồng nghiệp vụ chạy qua các Entity như thế nào?
>     
> 
> Đây là nền tảng để thiết kế ERD.

---

# Authentication Module

> [!success]  
> Nhóm Entity quản lý tài khoản người dùng và quyền sử dụng hệ thống.

---

## User → UserPlan

### Business Context

Một người dùng có thể sử dụng nhiều gói dịch vụ trong suốt vòng đời tài khoản.

Ví dụ:

```text
FREE
↓
PREMIUM
↓
PRO
```

### Relationship

```text
User 1 ---- N UserPlan
```

### Why

Cần lưu lịch sử thay đổi gói dịch vụ.

---

## SubscriptionPlan → UserPlan

### Business Context

Một gói dịch vụ có thể được nhiều User sử dụng.

### Relationship

```text
SubscriptionPlan 1 ---- N UserPlan
```

### Why

Cho phép nhiều User cùng đăng ký một loại Plan.

---

# AI Mock Interview Module

> [!success]  
> Đây là chức năng cốt lõi của toàn bộ nền tảng.
> 
> Người dùng có thể tạo cấu hình phỏng vấn, lựa chọn công nghệ, luyện tập nhiều lần và theo dõi sự tiến bộ qua từng phiên phỏng vấn.

---

## User → InterviewConfiguration

### Business Context

Trước khi bắt đầu phỏng vấn, User cần cấu hình nội dung luyện tập.

Ví dụ:

```text
Backend Developer

Junior

Mixed Interview

20 Questions

30 Minutes
```

### Relationship

```text
User 1 ---- N InterviewConfiguration
```

### Why

Một User có thể tạo nhiều cấu hình luyện tập khác nhau.

Ví dụ:

```text
Backend Junior

Backend Senior

System Design

Redis Interview
```

---

## InterviewConfiguration → InterviewConfigurationTechnology

### Business Context

Một cấu hình có thể sử dụng nhiều công nghệ.

Ví dụ:

```text
NestJS

Redis

Docker

PostgreSQL
```

### Relationship

```text
InterviewConfiguration 1 ---- N InterviewConfigurationTechnology
```

### Why

Cho phép mở rộng phạm vi câu hỏi theo nhiều công nghệ.

---

## Technology → InterviewConfigurationTechnology

### Business Context

Một công nghệ có thể xuất hiện trong nhiều cấu hình khác nhau.

### Relationship

```text
Technology 1 ---- N InterviewConfigurationTechnology
```

### Why

Tránh lưu trùng dữ liệu công nghệ.

---

## InterviewConfiguration → InterviewSession

### Business Context

Người dùng có thể luyện tập nhiều lần trên cùng một cấu hình.

Ví dụ:

```text
Backend Junior

Attempt #1

Attempt #2

Attempt #3
```

### Relationship

```text
InterviewConfiguration 1 ---- N InterviewSession
```

### Why

Cho phép theo dõi tiến độ và sự cải thiện theo thời gian.

---

## User → InterviewSession

### Business Context

Mỗi Session thuộc về một User cụ thể.

### Relationship

```text
User 1 ---- N InterviewSession
```

### Why

Lưu lịch sử luyện tập của từng User.

---

## InterviewSession → InterviewQuestion

### Business Context

Sau khi bắt đầu Session, AI sinh ra bộ câu hỏi tương ứng với cấu hình đã chọn.

### Relationship

```text
InterviewSession 1 ---- N InterviewQuestion
```

### Why

Một phiên phỏng vấn luôn bao gồm nhiều câu hỏi.

---

## InterviewQuestion → QuestionOption

### Business Context

Áp dụng cho câu hỏi trắc nghiệm.

### Relationship

```text
InterviewQuestion 1 ---- N QuestionOption
```

### Why

Một câu hỏi có nhiều lựa chọn.

---

## InterviewQuestion → InterviewAnswer

### Business Context

Người dùng trả lời từng câu hỏi.

### Relationship

```text
InterviewQuestion 1 ---- N InterviewAnswer
```

### Why

Cho phép luyện tập lại hoặc đánh giá lại trong tương lai.

---

## InterviewAnswer → AnswerReview

### Business Context

AI đánh giá câu trả lời của User.

### Relationship

```text
InterviewAnswer 1 ---- N AnswerReview
```

### Why

Cho phép:

```text
Re-Evaluate

Multiple AI Models

Compare Results

Audit History
```

---

## InterviewSession → InterviewReport

### Business Context

Sau khi hoàn thành Session, hệ thống tạo báo cáo tổng hợp.

### Relationship

```text
InterviewSession 1 ---- 1 InterviewReport
```

### Why

Mỗi phiên luyện tập chỉ có một báo cáo cuối cùng.

---

## Business Flow

```text
User
 ↓
Interview Configuration
 ↓
Select Technologies
 ↓
Start Interview Session
 ↓
Generate Questions
 ↓
Submit Answers
 ↓
AI Review
 ↓
Generate Report
```

---

# AI Voice Interview Module

> [!warning]  
> Chức năng phỏng vấn bằng giọng nói được thiết kế để mở rộng trong tương lai.

---

## User → VoiceInterview

### Business Context

Một User có thể thực hiện nhiều phiên Voice Interview.

### Relationship

```text
User 1 ---- N VoiceInterview
```

### Why

Lưu lịch sử luyện phỏng vấn bằng giọng nói.

---

## VoiceInterview → VoiceMessage

### Business Context

Một cuộc hội thoại bao gồm nhiều tin nhắn.

### Relationship

```text
VoiceInterview 1 ---- N VoiceMessage
```

### Why

Lưu toàn bộ lịch sử trao đổi giữa User và AI.

---

# AI CV Review Module

> [!success]  
> Chức năng đánh giá CV bằng AI.

---

## User → CV

### Business Context

Một User có thể tải lên nhiều CV.

### Relationship

```text
User 1 ---- N CV
```

### Why

Cho phép quản lý nhiều phiên bản CV.

---

## CV → CVReview

### Business Context

Một CV có thể được đánh giá nhiều lần.

### Relationship

```text
CV 1 ---- N CVReview
```

### Why

Theo dõi quá trình cải thiện CV.

---

# CV Builder Module

> [!success]  
> Chức năng tạo CV từ các mẫu có sẵn.

---

## CVTemplate → UserCV

### Business Context

Một Template có thể được nhiều User sử dụng.

### Relationship

```text
CVTemplate 1 ---- N UserCV
```

---

## User → UserCV

### Business Context

Một User có thể tạo nhiều CV khác nhau.

### Relationship

```text
User 1 ---- N UserCV
```

### Why

Cho phép tạo CV theo từng vị trí ứng tuyển.

---

# Job Aggregator Module

> [!success]  
> Thu thập và phân loại việc làm từ nhiều nguồn.

---

## User → SavedJob

### Business Context

Người dùng có thể lưu nhiều Job quan tâm.

### Relationship

```text
User 1 ---- N SavedJob
```

---

## Job → SavedJob

### Business Context

Một Job có thể được nhiều User lưu.

### Relationship

```text
Job 1 ---- N SavedJob
```

---

## Technology → JobTechnology

### Relationship

```text
Technology 1 ---- N JobTechnology
```

---

## Job → JobTechnology

### Relationship

```text
Job 1 ---- N JobTechnology
```

### Why

Một Job thường yêu cầu nhiều công nghệ.

Ví dụ:

```text
Java

Spring Boot

Redis

Docker
```

---

# Summary

## Core Relationships

```text
User
├── UserPlan
├── InterviewConfiguration
│      ├── InterviewConfigurationTechnology
│      └── InterviewSession
│              ├── InterviewQuestion
│              │      ├── QuestionOption
│              │      └── InterviewAnswer
│              │              └── AnswerReview
│              └── InterviewReport
│
├── VoiceInterview
│      └── VoiceMessage
│
├── CV
│      └── CVReview
│
├── UserCV
│
└── SavedJob

Technology
├── InterviewConfigurationTechnology
└── JobTechnology

CVTemplate
└── UserCV

Job
├── JobTechnology
└── SavedJob

SubscriptionPlan
└── UserPlan
```

---

## Next Step

```text
ERD Design
```

Tại bước tiếp theo sẽ xác định:

```text
Primary Key

Foreign Key

Cardinality

Constraints

Indexes

Data Types
```