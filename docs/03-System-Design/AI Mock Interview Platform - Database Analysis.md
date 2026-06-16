> [!abstract]  
> Database Analysis nhằm xác định dữ liệu nào cần được lưu trữ để hỗ trợ các chức năng nghiệp vụ của hệ thống.
> 
> Trước khi nghĩ đến bảng hay cột, cần xác định:
> 
> - Hệ thống làm được gì?
> - Người dùng thao tác như thế nào?
> - Những dữ liệu nào cần được lưu lại?

---

# Core Business Functions

> [!success]  
> Đây là các chức năng tạo ra giá trị cốt lõi của sản phẩm.

```
AI Mock Interview

AI Voice Interview

AI CV Review

CV Builder

Job Aggregator
```

---

# Authentication

## Business Goal

Cho phép người dùng đăng ký, đăng nhập và sử dụng các chức năng cá nhân hóa.

---

## Required Data

### User

Lưu thông tin người sử dụng hệ thống.

Ví dụ:

```
Email
Password
Avatar
Profile
```

---

### Plan

Lưu thông tin các gói dịch vụ.

Ví dụ:

```
Free

Premium

Pro
```

---

### UserPlan

Lưu lịch sử sử dụng gói dịch vụ của người dùng.

Ví dụ:

```
User A

FREE
↓
PREMIUM
```

---

# AI Mock Interview

> [!success]  
> Đây là chức năng quan trọng nhất của toàn bộ hệ thống.

## Business Flow

```
User
↓
Create Interview
↓
Choose Position
↓
Choose Experience
↓
Choose Technology
↓
Generate Questions
↓
Answer Questions
↓
AI Evaluation
↓
Generate Report
```

---

## Required Data

### Interview

Lưu một phiên phỏng vấn hoàn chỉnh.

Ví dụ:

```
Backend Developer

Junior

NestJS

Redis
```

---

### Technology

Danh sách công nghệ được hệ thống hỗ trợ.

Ví dụ:

```
Java

Spring Boot

NestJS

Redis

Docker
```

---

### InterviewTechnology

Liên kết Interview với Technology.

Một Interview có thể chứa nhiều Technology.

---

### Question

Lưu câu hỏi được AI sinh ra.

Ví dụ:

```
JWT là gì?

Redis Persistence là gì?
```

---

### QuestionOption

Lưu các đáp án của câu hỏi trắc nghiệm.

Ví dụ:

```
A

B

C

D
```

---

### Answer

Lưu câu trả lời của người dùng.

Ví dụ:

```
Text Answer

Code Answer
```

---

### AnswerEvaluation

Lưu kết quả chấm điểm của AI.

Ví dụ:

```
Score

Feedback

Strengths

Weaknesses
```

---

### InterviewReport

Lưu báo cáo cuối cùng của một phiên phỏng vấn.

Ví dụ:

```
Overall Score

Strengths

Weaknesses

Improvement Plan
```

---

# AI Voice Interview

> [!warning]  
> Chưa thuộc MVP nhưng cần chuẩn bị dữ liệu từ sớm.

## Business Flow

```
User
↓
Voice Conversation
↓
AI Interviewer
↓
AI Evaluation
```

---

## Required Data

### InterviewSession

Đại diện cho một phiên phỏng vấn bằng giọng nói.

---

### InterviewMessage

Lưu lịch sử hội thoại.

Ví dụ:

```
USER

AI

USER

AI
```

---

# AI CV Review

> [!success]  
> Hỗ trợ đánh giá chất lượng CV bằng AI.

## Business Flow

```
Upload CV
↓
Analyze CV
↓
AI Evaluation
↓
Review Report
```

---

## Required Data

### CV

Lưu file CV của người dùng.

---

### CVReview

Lưu kết quả đánh giá CV.

Ví dụ:

```
Score

Strengths

Weaknesses

Suggestions
```

---

# CV Builder

> [!success]  
> Hỗ trợ tạo CV theo mẫu có sẵn.

## Business Flow

```
Choose Template
↓
Fill Information
↓
Generate CV
↓
Export PDF / DOCX
```

---

## Required Data

### CVTemplate

Lưu các mẫu CV.

Ví dụ:

```
Intern Template

Backend Template

Frontend Template
```

---

### GeneratedCV

Lưu CV được tạo từ Template.

---

# Job Aggregator

> [!success]  
> Thu thập và phân loại việc làm từ các nguồn bên ngoài.

## Business Flow

```
Collect Jobs
↓
Classify Jobs
↓
Recommend Jobs
↓
User Save Jobs
```

---

## Required Data

### Job

Lưu thông tin tuyển dụng.

Ví dụ:

```
Position

Company

Salary

Location

Technology
```

---

### JobTechnology

Liên kết Job với Technology.

---

### SavedJob

Lưu các Job được User quan tâm.

---

# Current Candidate Entities

```
User

Plan
UserPlan

Interview
Technology
InterviewTechnology

Question
QuestionOption

Answer
AnswerEvaluation

InterviewReport

InterviewSession
InterviewMessage

CV
CVReview

CVTemplate
GeneratedCV

Job
JobTechnology
SavedJob
```

---

# Deliverables

Sau khi hoàn thành Database Analysis phải trả lời được:

```
Có những dữ liệu nào cần lưu?

Tại sao phải lưu?

Dữ liệu đó phục vụ chức năng nào?

Dữ liệu đó thuộc nghiệp vụ nào?
```

Bước tiếp theo:

```
Domain Relationship Analysis
↓
ERD Design
```