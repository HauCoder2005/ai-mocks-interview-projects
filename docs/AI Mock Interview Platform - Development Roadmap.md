## Phase 1 - Product Discovery

### 1. Product Vision (DONE)

Mục tiêu:

- Xác định vấn đề cần giải quyết.
    
- Xác định giá trị cốt lõi của sản phẩm.
    
- Xác định đối tượng người dùng.
    

Kết quả:

- AI Mock Interview.
    
- AI CV Review.
    
- AI CV Builder.
    
- IT Job Aggregator.
    

---

### 2. Business Analysis (DONE)

Mục tiêu:

- Phân tích nghiệp vụ.
    
- Xác định đầu vào và đầu ra của hệ thống.
    
- Xác định các tính năng chính.
    

Kết quả:

- Mock Interview.
    
- CV Review.
    
- CV Builder.
    
- Job Aggregator.
    
- Interview Report.
    
- Improvement Suggestion.
    

---

### 3. AI Feasibility Study (DONE)

Mục tiêu:

- Kiểm tra khả năng áp dụng AI.
    
- Đánh giá chất lượng các mô hình.
    

Đã thực hiện:

- Benchmark Llama 3 8B.
    
- Benchmark DeepSeek R1 8B.
    
- Chốt hướng sử dụng Ollama.
    

Kết quả hiện tại:

- Ollama.
    
- Llama 3 8B (tạm thời).
    

---

# Phase 2 - System Analysis

### 4. Requirement Analysis

Mục tiêu:

- Xác định Actor.
    
- Xác định Functional Requirements.
    
- Xác định Non-Functional Requirements.
    
- Xác định phạm vi MVP.
    

Kết quả:

- Danh sách chức năng chi tiết.
    
- Danh sách yêu cầu hệ thống.
    

---

### 5. Use Case Diagram

Mục tiêu:

- Mô hình hóa tương tác giữa Actor và hệ thống.
    

Kết quả:

- Guest Use Cases.
    
- User Use Cases.
    
- Admin Use Cases.
    

---

### 6. System Flow

Mục tiêu:

- Phân tích luồng hoạt động của hệ thống.
    

Kết quả:

- Interview Flow.
    
- CV Review Flow.
    
- CV Builder Flow.
    
- Job Aggregator Flow.
    

---

### 7. Domain Model

Mục tiêu:

- Xác định các thực thể nghiệp vụ.
    

Kết quả:

```text
User
Interview
Question
Answer
InterviewResult
CV
CVReview
CVTemplate
Job
SavedJob
```

---

# Phase 3 - System Design

### 8. Architecture Design

Mục tiêu:

- Thiết kế kiến trúc tổng thể.
    

Kết quả:

```text
NextJS
    ↓
NestJS
    ↓
PostgreSQL
Redis
MinIO
Ollama
Llama 3 8B
```

---

### 9. Database Design

Mục tiêu:

- Thiết kế Database.
    

Kết quả:

- ERD.
    
- Table Design.
    
- Relationship Design.
    
- Index Strategy.
    

---

### 10. API Design

Mục tiêu:

- Thiết kế REST API.
    

Kết quả:

```text
Auth APIs
Interview APIs
CV APIs
Job APIs
Admin APIs
```

---

### 11. UI/UX Design

Mục tiêu:

- Thiết kế giao diện người dùng.
    

Kết quả:

- User Flow.
    
- Wireframe.
    
- Design System.
    
- Responsive Layout.
    

---

# Phase 4 - Development

### 12. Development

#### Backend

```text
Java Spring Boot hoặc NestJS
PostgreSQL
Redis
MinIO
Ollama
```

#### Frontend

```text
NextJS
TypeScript
TailwindCSS
Shadcn UI
```

#### AI Layer

```text
Prompt Templates
Interview Engine
Answer Evaluation Engine
CV Review Engine
Job Recommendation Engine
```

---

### 13. Testing

Mục tiêu:

- Đảm bảo chất lượng hệ thống.
    

Kết quả:

```text
Unit Test
Integration Test
AI Prompt Testing
Performance Testing
```

---

### 14. Deployment

Mục tiêu:

- Triển khai hệ thống.
    

Kết quả:

```text
Docker
Docker Compose
CI/CD
Monitoring
Logging
```

---

# MVP Scope

## Included

```text
Authentication
AI Mock Interview
Interview Report
CV Review
CV Builder
Job Aggregator
```

## Excluded

```text
Realtime Voice Interview
Video Interview
Mobile App
Payment Gateway
```

---

# Current Progress

```text
1. Product Vision              ✅
2. Business Analysis           ✅
3. AI Feasibility Study        ✅
4. Requirement Analysis        ⏳
5. Use Case Diagram            ⏳
6. System Flow                 ⏳
7. Domain Model                ⏳
8. Architecture Design         ⏳
9. Database Design             ⏳
10. API Design                 ⏳
11. UI/UX                      ⏳
12. Development                ⏳
```