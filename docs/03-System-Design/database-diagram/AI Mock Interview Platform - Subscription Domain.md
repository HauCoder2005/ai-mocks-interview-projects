> [!abstract]  
> Subscription Domain chịu trách nhiệm quản lý các gói dịch vụ và quyền sử dụng của người dùng.
> 
> Hiện tại Domain này chưa được triển khai trong MVP.
> 
> Tuy nhiên cần được thiết kế từ sớm để tránh thay đổi Database lớn trong tương lai.

---

# Why Design Now?

> [!question]  
> Tại sao chưa làm nhưng vẫn thiết kế?

---

## Reason 1

Sau này hệ thống có thể phát sinh:

```
Chi phí OpenAI

Chi phí Gemini

Chi phí Hosting

Chi phí Database
```

---

## Reason 2

Một số tính năng có thể cần giới hạn:

```
Mock Interview

Voice Interview

CV Review
```

---

## Reason 3

Cho phép kiểm soát tài nguyên hệ thống.

---

# Domain Overview

```
Plan
 ↓
User Subscription
 ↓
Feature Access
```

---

# Business Flow

```
User
 ↓
Select Plan
 ↓
Subscribe
 ↓
Activate Plan
 ↓
Use Features
 ↓
Plan Expired
 ↓
Renew Plan
```

---

# Tables

```
subscription_plans

user_subscriptions
```

---

# Table: subscription_plans

> [!success]  
> Quản lý các gói dịch vụ của nền tảng.

---

## Business Purpose

Lưu cấu hình các gói sử dụng.

Ví dụ:

```
FREE

PREMIUM

PRO
```

---

## Example

### FREE

```
10 Interviews / Month

3 CV Reviews / Month

No Voice Interview
```

---

### PREMIUM

```
Unlimited Interviews

20 CV Reviews

20 Voice Interviews
```

---

# Fields

### id

Primary Key.

---

### name

Tên gói.

Ví dụ:

```
FREE

PREMIUM

PRO
```

---

### description

Mô tả gói dịch vụ.

---

### price

Giá tiền.

Ví dụ:

```
0

199000

499000
```

---

### interview_limit

Số lượt Mock Interview.

---

### cv_review_limit

Số lượt CV Review.

---

### voice_interview_limit

Số lượt Voice Interview.

---

### created_at

Ngày tạo.

---

### updated_at

Ngày cập nhật.

---

# Table: user_subscriptions

> [!success]  
> Lưu lịch sử đăng ký gói của User.

---

## Business Purpose

Một User có thể thay đổi nhiều gói trong suốt vòng đời tài khoản.

Ví dụ:

```
FREE
 ↓
PREMIUM
 ↓
PRO
```

---

# Fields

### id

Primary Key.

---

### user_id

> [!warning]  
> Foreign Key → users

Người sở hữu gói.

---

### plan_id

> [!warning]  
> Foreign Key → subscription_plans

Gói dịch vụ được đăng ký.

---

### started_at

Ngày kích hoạt.

---

### expired_at

Ngày hết hạn.

---

### status

Trạng thái.

Ví dụ:

```
ACTIVE

EXPIRED

CANCELLED
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
subscription_plans
           │
           └── user_subscriptions
                        │
                        └── users
```

---

# Future Integrations

> [!tip]  
> Khi triển khai thanh toán có thể mở rộng thêm.

Ví dụ:

```
payments

payment_transactions

payment_methods

invoices
```

---

# MVP Strategy

> [!warning]  
> Trong giai đoạn hiện tại.

Có thể:

```
Không triển khai Domain này

Không triển khai Payment

Không triển khai Billing
```

---

Tập trung vào:

```
Interview Domain

CV Domain

Job Domain

Voice Interview Domain
```

để xác thực nhu cầu thị trường trước.

---

# Summary

> [!success]  
> Subscription Domain là nền tảng cho mô hình kiếm tiền trong tương lai.

Bao gồm:

```
subscription_plans

user_subscriptions
```

Chịu trách nhiệm:

```
Quản lý gói dịch vụ

Giới hạn tính năng

Quản lý thời hạn sử dụng

Mở rộng thanh toán
```

và giúp nền tảng sẵn sàng cho giai đoạn thương mại hóa.