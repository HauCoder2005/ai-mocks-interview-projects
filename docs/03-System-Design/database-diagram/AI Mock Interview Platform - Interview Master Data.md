> [!abstract]  
> Interview Master Data là tập dữ liệu nền tảng phục vụ toàn bộ chức năng Mock Interview.
> 
> Domain này không trực tiếp tham gia phỏng vấn.
> 
> Nhiệm vụ chính:
> 
> - Chuẩn hóa dữ liệu
> - Quản lý Position
> - Quản lý Level
> - Quản lý Topic
> - Quản lý Technology
> 
> Đây là nguồn dữ liệu đầu vào cho:
> 
> - Question Bank
> - Interview Configuration
> - Voice Interview

---

# Domain Overview

> [!info]  
> Trước khi người dùng bắt đầu luyện phỏng vấn, hệ thống cần biết:
> 
> - Họ muốn phỏng vấn vị trí gì?
> - Họ đang ở level nào?
> - Họ muốn ôn chủ đề gì?
> - Họ muốn sử dụng công nghệ nào?

---

## Business Flow

```
User
 ↓
Select Position
 ↓
Select Level
 ↓
Select Topic
 ↓
Select Technology
 ↓
Create Interview Configuration
```

---

# Table: interview_positions

> [!success]  
> Quản lý các vị trí nghề nghiệp mà hệ thống hỗ trợ.

---

## Business Purpose

Người dùng phải xác định vị trí muốn luyện phỏng vấn.

Ví dụ:

```
Backend Developer

Frontend Developer

Fullstack Developer

DevOps Engineer

Mobile Developer

Data Engineer
```

---

## Why Need This Table?

Nếu lưu trực tiếp:

```
position = "Backend Developer"
```

sẽ gây:

```
Trùng dữ liệu

Khó thống kê

Khó mở rộng
```

---

## Fields

### id

Primary Key.

---

### name

Tên Position.

Ví dụ:

```
Backend Developer
```

---

### description

Mô tả Position.

Ví dụ:

```
Responsible for designing APIs and backend systems.
```

---

### created_at

Ngày tạo dữ liệu.

---

### updated_at

Ngày cập nhật dữ liệu.

---

# Table: interview_levels

> [!success]  
> Xác định độ seniority của buổi phỏng vấn.

---

## Business Purpose

Mỗi Position có nhiều cấp độ.

Ví dụ:

```
Intern

Fresher

Junior

Middle

Senior
```

---

## Why Need This Table?

Cùng một câu hỏi:

```
JWT là gì?
```

Level:

```
Intern
```

sẽ khác:

```
Senior
```

---

## Fields

### id

Primary Key.

---

### name

Tên cấp độ.

Ví dụ:

```
Junior
```

---

### display_order

Thứ tự hiển thị.

Ví dụ:

```
Intern = 1

Fresher = 2

Junior = 3

Middle = 4

Senior = 5
```

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: interview_topics

> [!success]  
> Quản lý nhóm kiến thức cần luyện tập.

---

## Business Purpose

Một buổi phỏng vấn không chỉ phụ thuộc vào Technology.

Nó còn phụ thuộc vào Topic.

Ví dụ:

```
Authentication

Authorization

Database

Redis

Docker

System Design

Microservices
```

---

## Why Need This Table?

Ví dụ:

```
NestJS
```

có thể xuất hiện trong:

```
Authentication

Authorization

Microservices
```

---

Technology và Topic là hai khái niệm khác nhau.

---

## Fields

### id

Primary Key.

---

### name

Tên Topic.

---

### description

Mô tả Topic.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: interview_technologies

> [!success]  
> Quản lý công nghệ được sử dụng trong phỏng vấn.

---

## Business Purpose

Lưu danh sách công nghệ mà hệ thống hỗ trợ.

Ví dụ:

```
Java

Spring Boot

NestJS

Redis

Docker

PostgreSQL

React

NextJS

AWS
```

---

## Why Need This Table?

Một Technology được sử dụng bởi nhiều Module:

```
Question Bank

Interview Configuration

Job Matching

CV Analysis
```

---

Do đó cần quản lý tập trung.

---

## Fields

### id

Primary Key.

---

### name

Tên công nghệ.

Ví dụ:

```
NestJS
```

---

### slug

Tên rút gọn.

Ví dụ:

```
nestjs

spring-boot

postgresql
```

Dùng cho:

```
URL

Search

Filter
```

---

### description

Mô tả công nghệ.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Relationships

> [!warning]  
> Đây là các bảng Master Data.
> 
> Chúng không lưu kết quả phỏng vấn.

---

## Used By Question Bank

```
interview_topics
          │
          └── interview_question_banks

interview_technologies
          │
          └── interview_question_banks
```

---

## Used By Interview Configuration

```
interview_positions
          │
          └── interview_configurations

interview_levels
          │
          └── interview_configurations

interview_topics
          │
          └── interview_configuration_topics

interview_technologies
          │
          └── interview_configuration_technologies
```

---

## Used By Voice Interview

```
interview_positions
          │
          └── voice_interview_sessions

interview_levels
          │
          └── voice_interview_sessions
```

---

# Summary

> [!success]  
> Interview Master Data là nền móng của toàn bộ hệ thống phỏng vấn.

Bao gồm:

```
interview_positions

interview_levels

interview_topics

interview_technologies
```

Các bảng này chịu trách nhiệm:

```
Chuẩn hóa dữ liệu

Tổ chức nội dung phỏng vấn

Phân loại câu hỏi

Cấu hình buổi phỏng vấn

Phục vụ AI Evaluation
```

và được sử dụng bởi toàn bộ các Domain liên quan đến Interview.