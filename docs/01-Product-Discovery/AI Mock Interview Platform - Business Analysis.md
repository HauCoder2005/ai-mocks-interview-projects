
> [!abstract]  
> AI Interview Assistant là nền tảng hỗ trợ sinh viên và lập trình viên luyện tập phỏng vấn thông qua AI. Hệ thống tập trung vào việc mô phỏng phỏng vấn, đánh giá năng lực, chỉ ra điểm mạnh, điểm yếu và đề xuất lộ trình cải thiện trước khi ứng tuyển thực tế.

---

# 1. Mục Tiêu Dự Án

> [!info]  
> Mục tiêu chính của hệ thống là giúp người dùng đánh giá mức độ sẵn sàng cho các vị trí công việc trong ngành Công nghệ Thông tin.

Hệ thống cần giúp người dùng trả lời được các câu hỏi:

- Tôi đang ở trình độ nào?
    
- Tôi có đủ khả năng ứng tuyển vào vị trí mong muốn hay không?
    
- Tôi đang thiếu những kỹ năng gì?
    
- Tôi cần cải thiện những gì để vượt qua vòng phỏng vấn?
    

---

# 2. Chức Năng Cốt Lõi

## AI Mock Interview

> [!success]  
> Đây là chức năng trung tâm của toàn bộ hệ thống.

Người dùng sẽ tạo một phiên phỏng vấn bằng cách lựa chọn các thông tin phù hợp với nhu cầu của mình.

### Position

```text
Backend Developer
Frontend Developer
Fullstack Developer
DevOps Engineer
QA Engineer
Data Analyst
Mobile Developer
```

### Experience Level

```text
Intern
Fresher
Junior
```

### Programming Language

```text
Java
TypeScript
JavaScript
Python
Go
C#
PHP
```

### Framework / Technology

```text
Spring Boot
NestJS
ExpressJS
ASP.NET
ReactJS
NextJS
VueJS
Angular
```

### Focus Topics (Optional)

```text
Redis
Docker
JWT
Database
Microservice
System Design
```

---

# 3. Hình Thức Phỏng Vấn

## Giai Đoạn MVP

> [!note]  
> Ưu tiên triển khai nhanh, tiết kiệm chi phí vận hành.

### Multiple Choice

Người dùng chọn đáp án.

```text
A
B
C
D
```

### Text Answer

Người dùng nhập câu trả lời dạng văn bản.

---

## Giai Đoạn Nâng Cao

> [!warning]  
> Chưa thuộc phạm vi MVP.

### Voice Interview

```text
User Voice
      ↓
Speech To Text
      ↓
AI Evaluation
```

### Realtime Voice Interview

```text
User Voice
      ↓
AI Interviewer
      ↓
AI Voice Response
```

---

# 4. Kết Quả Phỏng Vấn

> [!success]  
> Sau khi kết thúc phỏng vấn, hệ thống phải tạo báo cáo đánh giá chi tiết.

## Overall Score

Ví dụ:

```text
78 / 100
```

---

## Strengths

Những kỹ năng mà ứng viên thể hiện tốt.

Ví dụ:

```text
- OOP
- REST API
- Dependency Injection
- HTTP Fundamentals
```

---

## Areas For Improvement

Những kỹ năng còn yếu hoặc chưa đạt yêu cầu.

Ví dụ:

```text
- Redis
- Database Index
- Transaction
- Docker
```

---

## Improvement Recommendations

> [!tip]  
> Không chỉ chỉ ra điểm yếu mà còn phải hướng dẫn người dùng cải thiện.

Ví dụ:

### Redis

```text
- Redis Persistence
- Cache Aside Pattern
- Key Expiration
```

### Database

```text
- Clustered Index
- Composite Index
- Query Optimization
```

### Docker

```text
- Docker Network
- Docker Volume
- Docker Compose
```

---

## Interview Readiness

Ví dụ:

```text
Backend Intern:
Ready To Apply

Backend Fresher:
Need Improvement

Backend Junior:
Not Ready
```

---

# 5. Job Aggregator

> [!info]  
> Hệ thống tổng hợp và phân loại các việc làm IT mới nhất.

## Mục Tiêu

Giúp người dùng:

- Tìm việc nhanh hơn.
    
- Theo dõi thị trường tuyển dụng.
    
- Hiểu yêu cầu của doanh nghiệp.
    
- Xác định kỹ năng đang được tuyển dụng nhiều nhất.
    

---

## Bộ Lọc Công Việc

### Position

```text
Backend Developer
Frontend Developer
Fullstack Developer
DevOps Engineer
QA Engineer
Data Analyst
```

### Experience

```text
Intern
Fresher
Junior
```

### Location

```text
Ho Chi Minh City
Ha Noi
Da Nang
Remote
```

### Salary Range

```text
5 - 10 Million
10 - 15 Million
15 - 20 Million
20+ Million
```

### Technology

```text
Java
Spring Boot
NestJS
React
NextJS
Docker
Redis
```

---

# 6. CV Review

> [!success]  
> Hệ thống sử dụng AI để đánh giá chất lượng CV.

Người dùng tải lên:

```text
cv.pdf
```

AI thực hiện:

```text
Read CV
      ↓
Analyze Content
      ↓
Evaluate Quality
      ↓
Generate Feedback
```

---

## CV Score

Ví dụ:

```text
75 / 100
```

---

## CV Strengths

Ví dụ:

```text
- Có dự án thực tế
- Có Docker
- Có Redis
- Có GitHub
```

---

## CV Weaknesses

Ví dụ:

```text
- Thiếu mô tả dự án
- Thiếu thành tích nổi bật
- Thiếu ATS Keywords
- Trình bày chưa tối ưu
```

---

## CV Improvement Suggestions

Ví dụ:

Hiện tại:

```text
Built cinema booking website.
```

Đề xuất:

```text
Developed a cinema booking platform using NestJS, PostgreSQL and Redis supporting online ticket booking workflows.
```

---

# 7. CV Builder

> [!info]  
> Hệ thống cung cấp các mẫu CV chuẩn dành cho từng nhóm đối tượng.

## Supported Templates

```text
Intern Template
Fresher Template
Backend Developer Template
Frontend Developer Template
Fullstack Developer Template
```

---

## Chức Năng

- Tạo CV từ mẫu có sẵn.
    
- Xuất PDF.
    
- Tự động tối ưu bố cục.
    
- Hỗ trợ ATS Friendly Format.
    

---

# 8. Luồng Nghiệp Vụ Chính

```text
User
  ↓
Select Position
  ↓
Select Experience
  ↓
Select Technology
  ↓
Start Interview
  ↓
AI Generate Questions
  ↓
User Answers
  ↓
AI Evaluation
  ↓
Generate Report
  ↓
Show Strengths
  ↓
Show Weaknesses
  ↓
Show Improvement Plan
```

---

# 9. Giá Trị Mang Lại

> [!success]  
> Hệ thống không chỉ giúp người dùng luyện phỏng vấn.

Người dùng có thể:

- Đánh giá năng lực hiện tại.
    
- Biết điểm mạnh của bản thân.
    
- Biết điểm yếu cần cải thiện.
    
- Nhận lộ trình học tập phù hợp.
    
- Tìm kiếm việc làm phù hợp.
    
- Tối ưu CV trước khi ứng tuyển.
    
- Tăng khả năng vượt qua vòng phỏng vấn thực tế.
    

---

# 10. MVP Scope

> [!warning]  
> Chỉ tập trung vào những chức năng quan trọng nhất.

Bao gồm:

- Authentication
    
- AI Mock Interview
    
- Multiple Choice Questions
    
- Text Answer Questions
    
- Interview Evaluation
    
- Interview Report
    
- Job Aggregator
    
- CV Review
    
- CV Builder
    

Không bao gồm:

- Video Interview
    
- Realtime Voice Interview
    
- Human Interviewer
    
- Payment Gateway
    
- Mobile Application