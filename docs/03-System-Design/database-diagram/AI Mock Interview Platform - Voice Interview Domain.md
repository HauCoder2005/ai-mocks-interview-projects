> [!abstract]  
> Voice Interview Domain chịu trách nhiệm quản lý toàn bộ quá trình phỏng vấn bằng giọng nói với AI.
> 
> Đây là tính năng mô phỏng phỏng vấn thực tế nhất của hệ thống.
> 
> Chức năng:
> 
> - AI Interviewer
> - Voice Conversation
> - Follow-up Questions
> - Communication Evaluation
> - Soft Skill Evaluation
> - Technical Evaluation

---

# Domain Overview

> [!info]  
> Khác với Mock Interview truyền thống.
> 
> Voice Interview mô phỏng một cuộc phỏng vấn thực tế giữa:
> 
> ```
> AI Interviewer
>      ↕
>      User
> ```
> 
> Hệ thống sẽ ghi nhận toàn bộ hội thoại để phục vụ đánh giá sau phiên phỏng vấn.

---

# Business Flow

```
User
 ↓
Select Position
 ↓
Select Level
 ↓
Start Voice Interview
 ↓
AI Ask Question
 ↓
User Answer
 ↓
AI Follow-up Question
 ↓
Conversation Continue
 ↓
Interview End
 ↓
AI Evaluation
```

---

# Tables

```
voice_interview_sessions

voice_interview_messages
```

---

# Table: voice_interview_sessions

> [!success]  
> Đại diện cho một phiên phỏng vấn bằng giọng nói.

---

## Business Purpose

Mỗi lần User bắt đầu Voice Interview sẽ tạo ra một Session mới.

Ví dụ:

```
Voice Interview #1

Voice Interview #2

Voice Interview #3
```

---

# Fields

### id

Primary Key.

---

### user_id

> [!warning]  
> Foreign Key → users

Người thực hiện phỏng vấn.

---

### position_id

> [!warning]  
> Foreign Key → interview_positions

Vị trí muốn luyện tập.

Ví dụ:

```
Backend Developer

Frontend Developer

DevOps Engineer
```

---

### level_id

> [!warning]  
> Foreign Key → interview_levels

Độ seniority.

Ví dụ:

```
Junior

Middle

Senior
```

---

### status

Trạng thái phiên.

Ví dụ:

```
PENDING

IN_PROGRESS

COMPLETED
```

---

### started_at

Thời gian bắt đầu.

---

### completed_at

Thời gian kết thúc.

---

### created_at

Ngày tạo Session.

---

### updated_at

Ngày cập nhật Session.

---

# Table: voice_interview_messages

> [!success]  
> Lưu toàn bộ hội thoại trong phiên phỏng vấn.

---

## Business Purpose

Một Session có thể chứa hàng trăm tin nhắn.

Ví dụ:

```
AI: Tell me about yourself.

User: My name is Hau...

AI: What is Dependency Injection?

User: Dependency Injection is...
```

---

# Why Need This Table?

> [!question]  
> Tại sao không chỉ lưu Audio?

---

### Problems

```
Khó tìm kiếm

Khó đánh giá

Khó thống kê

Tốn dung lượng
```

---

### Solution

Lưu:

```
Transcript

Audio URL
```

đồng thời.

---

# Fields

### id

Primary Key.

---

### session_id

> [!warning]  
> Foreign Key → voice_interview_sessions

Tin nhắn thuộc Session nào.

---

### sender_type

Xác định người gửi.

Ví dụ:

```
AI

USER
```

---

### content

Transcript nội dung hội thoại.

Ví dụ:

```
What is Redis Persistence?
```

---

### audio_url

Đường dẫn file âm thanh.

Ví dụ:

```
s3://voice-interview/abc123.wav
```

---

### created_at

Thời điểm tin nhắn được tạo.

---

# Relationships

```
voice_interview_sessions
           │
           └── voice_interview_messages
```

---

# Difference Between Mock Interview & Voice Interview

## Mock Interview

```
Question
 ↓
Answer
 ↓
AI Review
```

---

## Voice Interview

```
Conversation
 ↓
Follow-up Questions
 ↓
Context Awareness
 ↓
AI Evaluation
```

---

# Future Enhancements

> [!tip]  
> Có thể mở rộng sau này.

Ví dụ:

```
Speech To Text

Emotion Detection

Confidence Detection

Speaking Speed Analysis

Pronunciation Analysis
```

---

# Summary

> [!success]  
> Voice Interview Domain là phiên bản nâng cao của Mock Interview.

Bao gồm:

```
voice_interview_sessions

voice_interview_messages
```

Chịu trách nhiệm:

```
Quản lý phiên phỏng vấn

Lưu hội thoại

Lưu audio

Đánh giá giao tiếp

Đánh giá kỹ năng mềm
```

và là tính năng có khả năng tạo khác biệt lớn nhất cho sản phẩm.