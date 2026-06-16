> [!abstract]  
> CV Domain chịu trách nhiệm quản lý toàn bộ dữ liệu liên quan tới CV của người dùng.
> 
> Bao gồm:
> 
> - CV Builder
> - CV Storage
> - CV Template
> - AI CV Review
> 
> Đây là Domain giúp người dùng xây dựng hồ sơ cá nhân và chuẩn bị ứng tuyển.

---

# Domain Overview

> [!info]  
> Sau khi luyện phỏng vấn, người dùng thường sẽ muốn:
> 
> - Hoàn thiện CV
> - Tối ưu CV
> - Đánh giá CV
> - Ứng tuyển công việc

---

## Business Flow

```
User
 ↓
Choose Template
 ↓
Create CV
 ↓
Add Education
 ↓
Add Experience
 ↓
Add Projects
 ↓
Add Skills
 ↓
Generate CV
 ↓
AI Review
 ↓
Improve CV
```

---

# Tables

```
cv_templates

user_cvs

user_cv_educations

user_cv_experiences

user_cv_projects

user_cv_skills

cv_reviews
```

---

# Table: cv_templates

> [!success]  
> Quản lý các mẫu CV của hệ thống.

---

## Business Purpose

Người dùng có thể chọn Template trước khi tạo CV.

---

## Example

```
Modern CV

Minimal CV

Developer CV

Professional CV
```

---

## Fields

### id

Primary Key.

---

### name

Tên Template.

---

### description

Mô tả Template.

---

### preview_image

Ảnh xem trước.

---

### template_file

File template gốc.

Ví dụ:

```
HTML

DOCX

JSON Template
```

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: user_cvs

> [!success]  
> Đại diện cho một CV hoàn chỉnh của User.

---

## Business Purpose

Một User có thể có nhiều CV.

Ví dụ:

```
Backend CV

Frontend CV

DevOps CV
```

---

## Relationships

```
users
  │
  └── user_cvs
          │
          ├── user_cv_educations
          ├── user_cv_experiences
          ├── user_cv_projects
          ├── user_cv_skills
          └── cv_reviews
```

---

## Fields

### id

Primary Key.

---

### user_id

FK → users

Chủ sở hữu CV.

---

### template_id

FK → cv_templates

Template được sử dụng.

---

### title

Tên CV.

Ví dụ:

```
Backend Developer CV
```

---

### summary

Phần giới thiệu bản thân.

---

### pdf_url

Đường dẫn file PDF đã xuất.

---

### docx_url

Đường dẫn file DOCX đã xuất.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: user_cv_educations

> [!success]  
> Lưu thông tin học vấn.

---

## Business Purpose

Một CV có thể có nhiều quá trình học tập.

---

## Example

```
Aptech

UTH

Coursera
```

---

## Fields

### cv_id

FK → user_cvs

---

### school_name

Tên trường.

---

### degree

Bằng cấp.

---

### field_of_study

Chuyên ngành.

---

### start_date

Ngày bắt đầu.

---

### end_date

Ngày kết thúc.

---

### description

Mô tả chi tiết.

---

# Table: user_cv_experiences

> [!success]  
> Lưu kinh nghiệm làm việc.

---

## Business Purpose

Một CV có thể có nhiều kinh nghiệm.

---

## Example

```
Backend Intern

Backend Developer

Senior Backend Developer
```

---

## Fields

### cv_id

FK → user_cvs

---

### company_name

Tên công ty.

---

### position

Vị trí làm việc.

---

### start_date

Ngày bắt đầu.

---

### end_date

Ngày kết thúc.

---

### description

Mô tả công việc.

---

# Table: user_cv_projects

> [!success]  
> Lưu dự án cá nhân hoặc dự án công ty.

---

## Business Purpose

Đây là phần rất quan trọng đối với Developer.

---

## Example

```
Cinema Booking System

E-Commerce Platform

AI Mock Interview Platform
```

---

## Fields

### cv_id

FK → user_cvs

---

### project_name

Tên dự án.

---

### description

Mô tả dự án.

---

### github_url

Link GitHub.

---

### demo_url

Link Demo.

---

# Table: user_cv_skills

> [!success]  
> Lưu kỹ năng xuất hiện trong CV.

---

## Example

```
Java

Spring Boot

NestJS

Docker

Redis
```

---

## Fields

### cv_id

FK → user_cvs

---

### skill_name

Tên kỹ năng.

---

### created_at

Ngày tạo.

---

# Table: cv_reviews

> [!success]  
> Lưu kết quả đánh giá CV bằng AI.

---

## Business Purpose

AI sẽ phân tích chất lượng CV.

---

## Example

```
Score: 85

Strengths:
- Strong Backend Skills

Weaknesses:
- Missing Achievements

Suggestions:
- Add Quantifiable Results
```

---

## Fields

### cv_id

FK → user_cvs

---

### score

Điểm tổng.

---

### strengths

Điểm mạnh.

---

### weaknesses

Điểm yếu.

---

### suggestions

Khuyến nghị cải thiện.

---

### created_at

Ngày đánh giá.

---

# Full Business Flow

> [!tip]  
> Luồng sử dụng thực tế.

```
Choose Template
 ↓
Create CV
 ↓
Add Education
 ↓
Add Experience
 ↓
Add Projects
 ↓
Add Skills
 ↓
Export PDF
 ↓
AI Review
 ↓
Improve CV
```

---

# Summary

> [!success]  
> CV Domain giúp người dùng xây dựng hồ sơ nghề nghiệp hoàn chỉnh.

Bao gồm:

```
cv_templates

user_cvs

user_cv_educations

user_cv_experiences

user_cv_projects

user_cv_skills

cv_reviews
```

Các bảng này chịu trách nhiệm:

```
Xây dựng CV

Quản lý học vấn

Quản lý kinh nghiệm

Quản lý dự án

Quản lý kỹ năng

Đánh giá CV bằng AI
```

	và đóng vai trò cầu nối giữa Mock Interview và Job Application.