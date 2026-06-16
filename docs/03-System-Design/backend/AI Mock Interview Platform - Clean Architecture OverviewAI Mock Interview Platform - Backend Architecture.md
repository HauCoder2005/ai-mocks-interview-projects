> [!INFO] Purpose
> 
> Tài liệu này mô tả kiến trúc Clean Architecture được áp dụng cho hệ thống AI Mock Interview Platform, giải thích cách các tầng trong backend tương tác với nhau và lý do lựa chọn mô hình này.

> [!SUCCESS] Architecture Decision
> 
> Hệ thống sử dụng:
> 
> - Architecture Pattern: Modular Monolith
> - Internal Structure: Clean Architecture
> - Backend Framework: NestJS
> - Frontend Framework: ReactJS
> - Database: MySQL
> - Cache: Redis
> - Object Storage: MinIO
> - Queue System: BullMQ
> - AI Provider: Meta Llama

> [!QUESTION] Why Clean Architecture?
> 
> Hệ thống không chỉ thực hiện CRUD đơn giản mà còn bao gồm:
> 
> - Authentication & Authorization
> - CV Upload & Management
> - AI Processing
> - Background Jobs
> - Question Bank Management
> - Interview Simulation
> - Subscription Management
> 
> Nếu toàn bộ nghiệp vụ được đặt trong Service Layer theo mô hình MVC truyền thống thì hệ thống sẽ nhanh chóng trở nên khó bảo trì và khó mở rộng.

---

# 1. What is Clean Architecture?

Clean Architecture là mô hình kiến trúc phần mềm được đề xuất bởi Robert C. Martin (Uncle Bob).

Mục tiêu:

> Business Logic không phụ thuộc Framework, Database, Cache, Queue hay AI Provider.

Điều này giúp hệ thống:

- Dễ bảo trì
- Dễ mở rộng
- Dễ kiểm thử
- Dễ thay thế công nghệ

---

# 2. Core Principle

> [!IMPORTANT]
> 
> Dependency chỉ được phép hướng từ ngoài vào trong.

```
Infrastructure
      ↓
Application
      ↓
Domain
```

Điều này có nghĩa:

Domain Layer không được biết:

- NestJS
- MySQL
- Redis
- MinIO
- BullMQ
- Meta Llama

Domain Layer chỉ biết:

- User
- CV
- Interview
- Question
- Answer
- Review

---

# 3. Architecture Layers

Toàn bộ backend được chia thành 4 tầng chính:

```
Presentation Layer
        ↓
Application Layer
        ↓
Domain Layer
        ↓
Infrastructure Layer
```

---

# 4. Presentation Layer

## Purpose

- Là điểm tiếp nhận request từ phía client.
- Controller + các thành phần hỗ trợ Controller

## Responsibilities

- Receive HTTP Requests
- Validate Input
- Authentication
- Authorization
- Return Response

## Components

```
Controllers
DTOs
Guards
Pipes
Interceptors
Exception Filters
```

## Flow

```
ReactJS
    ↓
Controller
    ↓
Use Case
```

> [!TIP]
> 
> Controller không được chứa Business Logic.
> 
> Controller chỉ nhận Request, gọi Use Case và trả Response.

### Example

```
POST /api/cv/upload
```

```
CVController
      ↓
UploadCVUseCase
```

---

# 5. Application Layer

## Purpose

Điều phối toàn bộ quy trình nghiệp vụ.

## Responsibilities

- Execute Use Cases
- Coordinate Services
- Control Workflow
- Call Infrastructure Components

## Components

```
UploadCVUseCase
AnalyzeCVUseCase
GenerateInterviewUseCase
EvaluateAnswerUseCase
CreateQuestionUseCase
```

> [!IMPORTANT]
> 
> Application Layer giống như "nhạc trưởng".
> 
> Nó không trực tiếp xử lý AI.
> 
> Nó không trực tiếp thao tác Database.
> 
> Nó chỉ điều phối luồng nghiệp vụ.

### Example

Upload CV:

```
1. Upload file
2. Save metadata
3. Create AI Job
```

Tất cả được điều phối bởi:

```
UploadCVUseCase
```

---

# 6. Domain Layer

## Purpose

Chứa các quy tắc nghiệp vụ cốt lõi của hệ thống.

> [!WARNING]
> 
> Đây là tầng quan trọng nhất của toàn bộ hệ thống.

## Core Entities

```
User
CV
InterviewSession
Question
Answer
Review
Subscription
```

## Business Rules

### Rule 1

Một Interview Session phải có ít nhất một Question.

### Rule 2

CV phải thuộc về một User.

### Rule 3

Review chỉ được tạo sau khi AI hoàn thành phân tích.

### Rule 4

Người dùng Free chỉ được phép tạo số lượng Interview Sessions giới hạn.

### Rule 5

Question phải thuộc một Category hoặc Topic cụ thể.

> [!IMPORTANT]
> 
> Các quy tắc này không phụ thuộc:
> 
> - Database
> - Framework
> - AI Provider
> - Cache
> - Queue

---

# 7. Infrastructure Layer

## Purpose

Cung cấp công nghệ cho hệ thống.

> [!WARNING]
> 
> Infrastructure là phần thay đổi nhiều nhất trong vòng đời dự án.

Ví dụ:

```
MySQL → PostgreSQL
MinIO → AWS S3
Meta Llama → Gemini
BullMQ → RabbitMQ
```

## Components

### Database

```
MySQL
```

Lưu trữ:

- Users
- CV Metadata
- Interview Sessions
- Questions
- Reviews
- Subscriptions

---

### Cache

```
Redis
```

Sử dụng cho:

- Session
- OTP
- Cache
- Rate Limiting

---

### Object Storage

```
MinIO
```

Lưu trữ:

- CV PDF
- Avatar
- Export Reports
- Generated Files

---

### Queue System

```
BullMQ
```

Xử lý:

- CV Analysis
- Question Generation
- Email Sending
- Background Processing

---

### AI Provider

```
Meta Llama
```

Chức năng:

- CV Review
- Interview Question Generation
- Answer Evaluation
- Feedback Generation

---

# 8. High Level Backend Architecture

```
                    User
                      │
                      ▼
                 ReactJS
                      │
                      ▼
                  NestJS
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
   MySQL           Redis           MinIO
                                         │
                                         ▼
                                      BullMQ
                                         │
                                         ▼
                                     Meta Llama
```

> [!SUCCESS]
> 
> NestJS đóng vai trò trung tâm điều phối toàn bộ hệ thống.

---

# 9. Upload CV Workflow

## Step 1 - Upload Request

```
User
 ↓
ReactJS
 ↓
NestJS
```

---

## Step 2 - Store File

```
NestJS
 ↓
MinIO
```

Lưu:

```
resume.pdf
```

---

## Step 3 - Save Metadata

```
NestJS
 ↓
MySQL
```

Lưu:

```
File Name
File Size
Object Key
User Id
Created Date
```

---

## Step 4 - Create Background Job

```
NestJS
 ↓
BullMQ
```

Tạo Job:

```
Analyze CV
```

---

## Step 5 - AI Processing

```
BullMQ Worker
 ↓
Meta Llama
```

Thực hiện:

- Extract Information
- Analyze Skills
- Detect Missing Skills
- Generate Feedback

---

## Step 6 - Save Review Result

```
Meta Llama
 ↓
MySQL
```

Lưu:

```
CV Review
Skill Assessment
Suggestions
Score
```

---

# 10. Why Not MVC?

MVC phù hợp với:

- Small CRUD Applications
- Internal Management Systems

Nhưng không phù hợp khi hệ thống có:

- AI Integration
- File Storage
- Queue Processing
- Multiple External Services

> [!WARNING]
> 
> Trong MVC, Service Layer thường trở thành "God Service" với hàng nghìn dòng code.

Ví dụ:

```
CVService

- Upload File
- Call AI
- Save Database
- Send Email
- Create Queue Job
- Cache Result
```

Điều này gây khó bảo trì khi hệ thống phát triển.

---

# 11. Benefits

## Maintainability

Dễ bảo trì khi dự án lớn lên.

## Scalability

Dễ mở rộng module mới.

## Testability

Dễ Unit Testing.

## Technology Independence

Có thể thay đổi:

```
Meta Llama → Gemini
MySQL → PostgreSQL
MinIO → AWS S3
```

mà ít ảnh hưởng tới Business Logic.

## Team Collaboration

Các nhóm có thể làm việc độc lập trên từng Layer.

---

# 12. Key Takeaways

> [!SUMMARY]
> 
> Sau khi đọc tài liệu này cần ghi nhớ:
> 
> 1. Clean Architecture có 4 tầng:
>     - Presentation
>     - Application
>     - Domain
>     - Infrastructure
> 2. Business Logic nằm trong Domain Layer.
> 3. Công nghệ nằm trong Infrastructure Layer.
> 4. Application Layer điều phối toàn bộ Use Cases.
> 5. Controller không chứa Business Logic.
> 6. Domain không phụ thuộc Framework.
> 7. Hệ thống sử dụng:
>     
>     Modular Monolith + Clean Architecture + NestJS.
>     
> 8. NestJS chỉ là Framework.
>     
>     Business Logic mới là tài sản quan trọng nhất của hệ thống.
>     

---

# Architecture Summary

```
Frontend
    ↓
ReactJS

Backend
    ↓
NestJS

Internal Structure
    ↓
Clean Architecture

Infrastructure
    ↓
MySQL
Redis
MinIO
BullMQ
```