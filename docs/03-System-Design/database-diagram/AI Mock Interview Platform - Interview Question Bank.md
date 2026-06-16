> [!abstract]  
> Interview Question Bank là kho dữ liệu câu hỏi của hệ thống.
> 
> Đây là nơi lưu trữ:
> 
> - Câu hỏi trắc nghiệm
> - Câu hỏi lý thuyết
> - Câu hỏi coding
> - Câu hỏi tình huống
> 
> Question Bank là nguồn dữ liệu để sinh ra Interview Session.

---

# Domain Overview

> [!info]  
> Một Interview Session không sinh ra từ hư không.
> 
> Hệ thống cần có nguồn dữ liệu ban đầu để:
> 
> - Tạo câu hỏi
> - Tạo bài test
> - Huấn luyện AI
> - Đánh giá người dùng

---

## Business Flow

```
Admin
 ↓
Create Question
 ↓
Store Question Bank
 ↓
User Create Interview Configuration
 ↓
System Select Questions
 ↓
Generate Interview Session
```

---

# Why Need Question Bank?

> [!question]  
> Đã có AI thì tại sao vẫn cần Question Bank?

---

## Reason 1 - Fallback Data

Nếu AI gặp lỗi:

```
OpenAI Down

Gemini Down

API Limit Reached
```

Hệ thống vẫn có thể hoạt động.

---

## Reason 2 - Quality Control

Admin có thể tự tạo:

```
Top 100 Backend Questions

Top 50 Redis Questions

Top 50 Docker Questions

Top 100 Java Interview Questions
```

---

## Reason 3 - Better Evaluation

Question Bank giúp:

```
Chuẩn hóa đánh giá

So sánh kết quả

Theo dõi tiến bộ
```

---

# Tables

```
interview_question_banks

interview_question_bank_options
```

---

# Table: interview_question_banks

> [!success]  
> Lưu trữ câu hỏi gốc của hệ thống.

---

## Business Purpose

Mỗi bản ghi đại diện cho một câu hỏi.

Ví dụ:

```
JWT là gì?

Redis Persistence là gì?

Docker Volume là gì?

Giải thích Dependency Injection.
```

---

# Fields

### id

Primary Key.

Định danh duy nhất cho Question.

---

### topic_id

> [!warning]  
> Foreign Key → interview_topics

Xác định câu hỏi thuộc Topic nào.

Ví dụ:

```
Authentication

Database

Redis
```

---

### technology_id

> [!warning]  
> Foreign Key → interview_technologies

Xác định câu hỏi liên quan công nghệ nào.

Ví dụ:

```
NestJS

Redis

Docker
```

---

### title

Tiêu đề ngắn.

Ví dụ:

```
JWT Authentication
```

---

### content

Nội dung chi tiết câu hỏi.

Ví dụ:

```
Giải thích JWT Authentication hoạt động như thế nào.
```

---

### question_type

Loại câu hỏi.

Ví dụ:

```
MCQ

THEORY

CODING

CASE_STUDY
```

---

### difficulty

Độ khó câu hỏi.

Ví dụ:

```
EASY

MEDIUM

HARD
```

---

### expected_answer

Đáp án kỳ vọng.

> [!tip]  
> AI sử dụng dữ liệu này để đánh giá câu trả lời của User.

---

### created_by

> [!warning]  
> Foreign Key → users

Xác định ai tạo câu hỏi.

Thông thường là:

```
ADMIN
```

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: interview_question_bank_options

> [!success]  
> Lưu các đáp án lựa chọn cho câu hỏi trắc nghiệm.

---

## Business Purpose

Áp dụng cho:

```
MCQ Questions
```

---

## Example

Question:

```
JWT là gì?
```

Options:

```
A

B

C

D
```

---

# Fields

### id

Primary Key.

---

### question_bank_id

> [!warning]  
> Foreign Key → interview_question_banks

Xác định Option thuộc Question nào.

---

### content

Nội dung đáp án.

Ví dụ:

```
JSON Web Token
```

---

### is_correct

Đáp án đúng hay không.

Ví dụ:

```
true

false
```

---

### display_order

Thứ tự hiển thị.

Ví dụ:

```
A = 1

B = 2

C = 3

D = 4
```

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Relationships

```
interview_topics
          │
          └── interview_question_banks

interview_technologies
          │
          └── interview_question_banks

users
          │
          └── interview_question_banks

interview_question_banks
          │
          └── interview_question_bank_options
```

---

# How Question Bank Is Used

> [!tip]  
> Đây là luồng sử dụng thực tế.

```
User
 ↓
Create Configuration
 ↓
Choose Topic
 ↓
Choose Technology
 ↓
System Query Question Bank
 ↓
Create Session Questions
 ↓
Start Interview
```

---

# Summary

> [!success]  
> Question Bank là tài sản tri thức của nền tảng.

Bao gồm:

```
interview_question_banks

interview_question_bank_options
```

Chịu trách nhiệm:

```
Lưu trữ câu hỏi

Lưu đáp án

Phân loại nội dung

Cung cấp dữ liệu cho Interview Session

Hỗ trợ AI Evaluation
```

và là nguồn dữ liệu đầu vào cho toàn bộ Interview Runtime.