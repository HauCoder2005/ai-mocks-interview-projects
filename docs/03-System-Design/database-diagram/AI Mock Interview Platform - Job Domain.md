> [!abstract]  
> Job Domain chịu trách nhiệm thu thập, quản lý và gợi ý việc làm cho người dùng.
> 
> Đây là Domain giúp kết nối kết quả luyện tập và CV với thị trường tuyển dụng thực tế.
> 
> Chức năng:
> 
> - Thu thập dữ liệu tuyển dụng
> - Quản lý kỹ năng yêu cầu
> - Lưu việc làm yêu thích
> - Theo dõi trạng thái ứng tuyển
> - Gợi ý việc làm phù hợp

---

# Domain Overview

> [!info]  
> Sau khi người dùng:
> 
> - Luyện phỏng vấn
> - Hoàn thiện CV
> 
> Hệ thống sẽ hỗ trợ tìm kiếm cơ hội việc làm phù hợp.

---

## Business Flow

```
User
 ↓
Search Jobs
 ↓
View Job Details
 ↓
Save Job
 ↓
Apply Job
 ↓
Track Application Status
```

---

# Tables

```
jobs

job_skills

job_skill_mappings

user_saved_jobs

user_job_applications
```

---

# Table: jobs

> [!success]  
> Lưu trữ dữ liệu tuyển dụng thu thập từ các nguồn bên ngoài.

---

## Business Purpose

Đây là bảng trung tâm của Job Domain.

Mỗi bản ghi đại diện cho một công việc.

---

## Example

```
Backend Developer

Frontend Developer

DevOps Engineer

Data Engineer
```

---

## Fields

### id

Primary Key.

---

### title

Tên vị trí tuyển dụng.

Ví dụ:

```
Backend Developer
```

---

### company_name

Tên công ty.

Ví dụ:

```
FPT Software

VNG

Shopee
```

---

### location

Địa điểm làm việc.

Ví dụ:

```
Ho Chi Minh City

Ha Noi

Remote
```

---

### salary_min

Mức lương tối thiểu.

---

### salary_max

Mức lương tối đa.

---

### experience_level

Yêu cầu kinh nghiệm.

Ví dụ:

```
Intern

Junior

Middle

Senior
```

---

### description

Mô tả công việc.

---

### source_url

URL bài tuyển dụng gốc.

---

### published_at

Ngày đăng tuyển.

---

### created_at

Ngày lưu vào hệ thống.

---

### updated_at

Ngày cập nhật.

---

# Table: job_skills

> [!success]  
> Danh sách kỹ năng mà hệ thống quản lý.

---

## Business Purpose

Chuẩn hóa kỹ năng để tránh dữ liệu trùng lặp.

---

## Example

```
Java

Spring Boot

NestJS

Docker

Redis

PostgreSQL
```

---

## Fields

### id

Primary Key.

---

### name

Tên kỹ năng.

---

### description

Mô tả kỹ năng.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: job_skill_mappings

> [!success]  
> Mapping giữa Job và Skill.

---

## Why Need This Table?

Một Job yêu cầu nhiều Skill.

Ví dụ:

```
Backend Developer
 ├── Java
 ├── Spring Boot
 ├── Redis
 └── Docker
```

Một Skill cũng có thể xuất hiện trong nhiều Job.

---

## Fields

### job_id

FK → jobs

---

### skill_id

FK → job_skills

---

### created_at

Ngày tạo.

---

# Table: user_saved_jobs

> [!success]  
> Lưu danh sách công việc yêu thích của User.

---

## Business Purpose

Cho phép người dùng đánh dấu Job để xem lại sau.

---

## Example

```
Save Job
 ↓
Saved Jobs
```

---

## Fields

### id

Primary Key.

---

### user_id

FK → users

---

### job_id

FK → jobs

---

### created_at

Ngày lưu Job.

---

# Table: user_job_applications

> [!success]  
> Theo dõi quá trình ứng tuyển của User.

---

## Business Purpose

Giúp User quản lý hành trình tìm việc.

---

## Example

```
Applied
 ↓
Interviewing
 ↓
Offer
```

---

## Fields

### id

Primary Key.

---

### user_id

FK → users

---

### job_id

FK → jobs

---

### status

Trạng thái ứng tuyển.

Ví dụ:

```
SAVED

APPLIED

INTERVIEWING

REJECTED

ACCEPTED
```

---

### notes

Ghi chú cá nhân.

---

### applied_at

Ngày ứng tuyển.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Relationships

```
jobs
 │
 ├── job_skill_mappings
 │          │
 │          └── job_skills
 │
 ├── user_saved_jobs
 │
 └── user_job_applications

users
 │
 ├── user_saved_jobs
 │
 └── user_job_applications
```

---

# Future Recommendation System

> [!tip]  
> Đây là nền tảng cho hệ thống Job Recommendation sau này.

Ví dụ:

```
User Skills
 +
Interview Results
 +
CV Analysis
 ↓
Recommended Jobs
```

---

# Summary

> [!success]  
> Job Domain giúp kết nối người dùng với thị trường tuyển dụng.

Bao gồm:

```
jobs

job_skills

job_skill_mappings

user_saved_jobs

user_job_applications
```

Các bảng này chịu trách nhiệm:

```
Thu thập việc làm

Quản lý kỹ năng

Lưu việc yêu thích

Theo dõi ứng tuyển

Gợi ý việc làm
```

và là đích đến cuối cùng của hành trình người dùng trên nền tảng.