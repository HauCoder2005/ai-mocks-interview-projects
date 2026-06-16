> [!abstract]  
> Authentication Domain chịu trách nhiệm quản lý tài khoản người dùng, xác thực và phân quyền trong hệ thống.
> 
> Đây là Domain nền tảng mà tất cả các Domain khác đều phụ thuộc vào.

---

# Domain Overview

> [!info]  
> Mọi dữ liệu trong hệ thống cuối cùng đều liên kết tới User.

```
User
│
├── Interview Domain
├── CV Domain
├── Job Domain
├── Voice Interview Domain
└── Subscription Domain
```

---

# Tables

```
roles

users
```

---

# Table: roles

> [!success]  
> Quản lý vai trò của người dùng trong hệ thống.

---

## Business Purpose

Hiện tại hệ thống chỉ có:

```
ADMIN

USER
```

Trong đó:

```
ADMIN
```

là người quản trị hệ thống.

```
USER
```

là người sử dụng nền tảng.

---

## Why Separate Table?

> [!question]  
> Tại sao không lưu role trực tiếp trong bảng users?

Ví dụ:

```
role = "ADMIN"
```

---

### Problems

```
Khó mở rộng

Dễ sai dữ liệu

Khó quản lý quyền
```

---

### Solution

Tách thành bảng:

```
roles
```

---

## Fields

### id

> [!tip]  
> Primary Key của Role.

Định danh duy nhất cho từng Role.

---

### name

Tên Role.

Ví dụ:

```
ADMIN

USER
```

---

### description

Mô tả chức năng của Role.

Ví dụ:

```
System Administrator

Platform User
```

---

### created_at

Ngày tạo Role.

---

### updated_at

Ngày cập nhật Role.

---

# Table: users

> [!success]  
> Bảng trung tâm của toàn bộ hệ thống.

Tất cả dữ liệu nghiệp vụ cuối cùng đều liên kết tới User.

---

## Business Purpose

Lưu thông tin người sử dụng nền tảng.

Ví dụ:

```
Nguyễn Văn A

Backend Developer

3 năm kinh nghiệm
```

---

## Relationships

```
roles
   │
   └── users
           │
           ├── interview_configurations
           ├── interview_sessions
           ├── user_cvs
           ├── user_saved_jobs
           ├── user_job_applications
           ├── voice_interview_sessions
           └── user_subscriptions
```

---

# Fields

### id

> [!tip]  
> Primary Key.

Định danh duy nhất của User.

---

### role_id

> [!warning]  
> Foreign Key tới bảng roles.

Xác định User thuộc Role nào.

Ví dụ:

```
ADMIN

USER
```

---

### email

Email đăng nhập.

Ví dụ:

```
user@gmail.com
```

---

### password_hash

Mật khẩu đã mã hóa.

> [!danger]  
> Không lưu mật khẩu dạng plain text.

---

### first_name

Tên.

Ví dụ:

```
Hậu
```

---

### last_name

Họ.

Ví dụ:

```
Huỳnh
```

---

### phone_number

Số điện thoại.

---

### avatar_url

Ảnh đại diện.

Lưu URL thay vì lưu file trực tiếp trong Database.

---

### headline

Tiêu đề giới thiệu bản thân.

Ví dụ:

```
Backend Developer | NestJS | PostgreSQL
```

---

### current_position

Vị trí hiện tại.

Ví dụ:

```
Backend Developer
```

---

### years_of_experience

Số năm kinh nghiệm.

Ví dụ:

```
0

1

3

5
```

---

### linkedin_url

Link LinkedIn.

---

### github_url

Link GitHub.

---

### portfolio_url

Link Portfolio cá nhân.

---

### is_verified

> [!tip]  
> Trạng thái xác minh tài khoản.

Ví dụ:

```
true

false
```

---

### last_login_at

Lần đăng nhập gần nhất.

Dùng để:

```
Theo dõi hoạt động

Thống kê người dùng
```

---

### created_at

Ngày tạo tài khoản.

---

### updated_at

Ngày cập nhật hồ sơ.

---

# Business Flow

```
Register
 ↓
Create User
 ↓
Verify Account
 ↓
Login
 ↓
Use Platform
```

---

# Summary

> [!success]  
> Authentication Domain là nền tảng của toàn bộ hệ thống.

Các bảng:

```
roles

users
```

chịu trách nhiệm:

```
Đăng ký

Đăng nhập

Quản lý hồ sơ

Phân quyền

Xác định chủ sở hữu dữ liệu
```

và được sử dụng bởi toàn bộ các Domain còn lại.