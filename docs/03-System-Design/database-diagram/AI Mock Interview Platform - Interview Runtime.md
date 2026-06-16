> [!abstract]  
> Interview Runtime là Domain chịu trách nhiệm tổ chức và quản lý toàn bộ quá trình phỏng vấn của người dùng.
> 
> Đây là nghiệp vụ cốt lõi của hệ thống.
> 
> Chức năng:
> 
> - Tạo cấu hình phỏng vấn
> - Sinh phiên phỏng vấn
> - Hiển thị câu hỏi
> - Thu thập câu trả lời
> - Đánh giá bằng AI
> - Sinh báo cáo cuối phiên

---

# Runtime Overview

> [!info]  
> Luồng nghiệp vụ chính của hệ thống.

```
User
 ↓
Interview Configuration
 ↓
Interview Session
 ↓
Session Questions
 ↓
Answers
 ↓
AI Review
 ↓
Interview Report
```

---

# Tables

```
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

---

# Table: interview_configurations

> [!success]  
> Lưu cấu hình phỏng vấn do User tạo.

---

## Business Purpose

Trước khi bắt đầu phỏng vấn User phải chọn:

```
Position

Level

Technology

Topic

Question Count

Duration
```

---

## Example

```
Backend Developer

Junior

NestJS

Redis

20 Questions

30 Minutes
```

---

# Fields

### id

Primary Key.

---

### user_id

> [!warning]  
> Foreign Key → users

Người tạo cấu hình.

---

### position_id

> [!warning]  
> Foreign Key → interview_positions

Vị trí muốn luyện tập.

---

### level_id

> [!warning]  
> Foreign Key → interview_levels

Độ seniority.

---

### name

Tên cấu hình.

Ví dụ:

```
Backend Junior Interview
```

---

### interview_type

Loại phỏng vấn.

Ví dụ:

```
MCQ

CODING

MIXED
```

---

### question_count

Số lượng câu hỏi.

---

### duration_minutes

Thời gian làm bài.

---

### description

Ghi chú cấu hình.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: interview_configuration_topics

> [!success]  
> Mapping Topic được chọn trong Configuration.

---

## Why Need This Table?

Một Configuration có thể chứa nhiều Topic.

Ví dụ:

```
Authentication

Database

Redis
```

---

# Fields

### configuration_id

FK → interview_configurations

---

### topic_id

FK → interview_topics

---

# Table: interview_configuration_technologies

> [!success]  
> Mapping Technology được chọn trong Configuration.

---

## Example

```
NestJS

Redis

Docker
```

---

# Fields

### configuration_id

FK → interview_configurations

---

### technology_id

FK → interview_technologies

---

# Table: interview_sessions

> [!success]  
> Đại diện cho một lần User thực sự tham gia phỏng vấn.

---

## Business Purpose

Một User có thể làm lại nhiều lần.

Ví dụ:

```
Attempt #1

Attempt #2

Attempt #3
```

---

# Fields

### id

Primary Key.

---

### configuration_id

FK → interview_configurations

---

### user_id

FK → users

---

### attempt_number

Số lần thực hiện.

Ví dụ:

```
1

2

3
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

Thời gian hoàn thành.

---

### duration_seconds

Tổng thời gian thực hiện.

---

### overall_score

Điểm tổng.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: interview_session_questions

> [!success]  
> Snapshot câu hỏi được sử dụng trong Session.

---

## Why Need This Table?

Question Bank có thể thay đổi.

Session cần lưu bản sao tại thời điểm làm bài.

---

## Example

```
Question Bank
 ↓
Copy
 ↓
Session Question
```

---

# Fields

### session_id

FK → interview_sessions

---

### question_bank_id

FK → interview_question_banks

---

### content

Nội dung câu hỏi tại thời điểm tạo Session.

---

### question_type

MCQ / THEORY / CODING.

---

### difficulty

Độ khó.

---

### display_order

Thứ tự câu hỏi.

---

# Table: interview_session_question_options

> [!success]  
> Snapshot Option của Question.

---

## Why Need This Table?

Nếu Question Bank thay đổi.

Session vẫn giữ nguyên dữ liệu cũ.

---

# Fields

### session_question_id

FK → interview_session_questions

---

### content

Nội dung Option.

---

### is_correct

Đáp án đúng.

---

### display_order

Thứ tự hiển thị.

---

# Table: interview_answers

> [!success]  
> Lưu câu trả lời của User.

---

## Business Purpose

Lưu toàn bộ kết quả làm bài.

---

# Fields

### session_question_id

FK → interview_session_questions

---

### user_id

FK → users

---

### selected_option_id

FK → interview_session_question_options

Áp dụng cho MCQ.

---

### answer_text

Áp dụng cho Theory.

---

### source_code

Áp dụng cho Coding.

---

### submitted_at

Thời điểm nộp bài.

---

# Table: interview_answer_reviews

> [!success]  
> Lưu kết quả đánh giá của AI.

---

## Business Purpose

AI phân tích từng câu trả lời.

---

# Fields

### answer_id

FK → interview_answers

---

### score

Điểm câu trả lời.

---

### feedback

Nhận xét.

---

### strengths

Điểm mạnh.

---

### weaknesses

Điểm yếu.

---

### suggestions

Đề xuất cải thiện.

---

### ai_model

Model sử dụng.

Ví dụ:

```
GPT-5

Gemini 3

Claude
```

---

# Table: interview_reports

> [!success]  
> Báo cáo cuối cùng của Session.

---

## Business Purpose

Tổng hợp toàn bộ kết quả.

---

# Fields

### session_id

FK → interview_sessions

---

### overall_score

Điểm tổng.

---

### technical_score

Điểm kỹ thuật.

---

### problem_solving_score

Điểm giải quyết vấn đề.

---

### communication_score

Điểm giao tiếp.

---

### strengths

Điểm mạnh tổng hợp.

---

### weaknesses

Điểm yếu tổng hợp.

---

### recommendations

Khuyến nghị học tập.

---

### learning_path

Lộ trình cải thiện.

---

### readiness_level

Đánh giá mức độ sẵn sàng.

Ví dụ:

```
NOT_READY

READY

STRONG_READY
```

---

# Full Runtime Flow

> [!tip]  
> Luồng nghiệp vụ thực tế.

```
Create Configuration
 ↓
Select Topic
 ↓
Select Technology
 ↓
Generate Session
 ↓
Generate Questions
 ↓
Answer Questions
 ↓
AI Review
 ↓
Generate Report
```

---

# Summary

> [!success]  
> Interview Runtime là trái tim của nền tảng.

Bao gồm:

```
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

Các bảng này chịu trách nhiệm:

```
Tổ chức phỏng vấn

Lưu kết quả

Đánh giá AI

Sinh báo cáo

Theo dõi tiến bộ người dùng
```

và tạo ra giá trị chính của toàn bộ sản phẩm.