## Architecture Style

```
Feature-Based Clean Architecture
+
Domain Driven Design (Lite)
+
Vertical Slice Architecture
```

---

# Design Principles

```
1. Dependency Inversion Principle

2. Single Responsibility Principle

3. Separation of Concerns

4. Feature-Based Organization

5. Infrastructure Isolation

6. Framework Independence

7. AI Provider Abstraction

8. Storage Abstraction

9. Queue Based Background Processing

10. Centralized Monitoring
```

---

# High Level Architecture

```
┌─────────────────────────────┐
│          CLIENT             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      PRESENTATION LAYER     │
│ Controllers • DTO • Guards │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      APPLICATION LAYER      │
│         Use Cases           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         DOMAIN LAYER        │
│ Entities • Services • Rules │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│   REPOSITORY CONTRACTS      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    INFRASTRUCTURE LAYER     │
└─────────────────────────────┘

Infrastructure

├── MySQL
├── Redis
├── MinIO
├── BullMQ
├── Gemini
├── OpenAI
├── Mail
└── Logger
```

---

# Root Structure

```
src

├── modules
│
├── infrastructure
│
├── jobs
│
├── shared
│
├── config
│
├── app.module.ts
│
└── main.ts
```

---

# Modules

```
modules

├── auth
├── users
├── interviews
├── question-bank
├── cv
├── reports
├── storage
├── ai
└── health
```

---

# Clean Architecture Module Structure

Ví dụ Interview Module

```
interviews

├── presentation
│
├── application
│
├── domain
│
├── infrastructure
│
├── interview.module.ts
│
├── interview.tokens.ts
│
└── interview.constants.ts
```

---

# Presentation Layer

Chịu trách nhiệm tiếp nhận request.

Không chứa business logic.

```
presentation

├── controllers
├── dto
├── requests
├── responses
└── swagger
```

Ví dụ

```
presentation

├── controllers

│   └── interview.controller.ts

│
├── dto

│   ├── start-interview.dto.ts

│   ├── submit-answer.dto.ts

│   └── finish-interview.dto.ts
```

Responsibilities

```
Receive Request

Validate DTO

Call Use Case

Return Response
```

---

# Application Layer

Điều phối luồng nghiệp vụ.

```
application

├── use-cases
├── commands
├── queries
└── mappers
```

Ví dụ

```
use-cases

├── start-interview.usecase.ts

├── submit-answer.usecase.ts

├── finish-interview.usecase.ts

├── get-report.usecase.ts

└── review-answer.usecase.ts
```

Responsibilities

```
Orchestrate Flow

Call Domain Services

Call Repository Contracts

Push Queue Jobs

Manage Transactions
```

---

# Domain Layer

Trái tim hệ thống.

Không được phụ thuộc:

```
NestJS

Prisma

Redis

BullMQ

MinIO

Gemini

OpenAI
```

---

Structure

```
domain

├── entities
├── value-objects
├── services
├── repositories
├── enums
└── events
```

---

Entities

```
entities

├── interview-session.entity.ts

├── interview-answer.entity.ts

├── interview-report.entity.ts

└── interview-configuration.entity.ts
```

---

Domain Services

```
services

├── interview.domain-service.ts

├── scoring.domain-service.ts

├── readiness.domain-service.ts

└── report.domain-service.ts
```

---

Repository Contracts

```
repositories

├── interview.repository.ts

├── answer.repository.ts

├── report.repository.ts

└── configuration.repository.ts
```

Responsibilities

```
Business Rules

Scoring Logic

Validation Rules

Interview Rules

Report Rules
```

---

# Infrastructure Layer (Module)

Implement các contract.

```
infrastructure

├── repositories
├── providers
└── mappers
```

Ví dụ

```
repositories

├── mysql-interview.repository.ts

├── mysql-answer.repository.ts

└── mysql-report.repository.ts
```

---

# Global Infrastructure

```
infrastructure

├── database
├── redis
├── minio
├── bullmq
├── ai-providers
├── logger
├── monitoring
├── tracing
└── mail
```

---

# Database

```
database

├── prisma

│   ├── schema.prisma

│   └── migrations

│
├── prisma.module.ts

└── prisma.service.ts
```

Responsibilities

```
MySQL Connection

Transactions

Database Access
```

---

# Redis

```
redis

├── cache.service.ts

├── redis.module.ts

└── redis.provider.ts
```

Responsibilities

```
Question Cache

Technology Cache

Topic Cache

AI Cache

Rate Limiting

Session Cache
```

---

# MinIO

```
minio

├── minio.module.ts

├── minio.service.ts

└── minio.provider.ts
```

Methods

```
upload()

delete()

getSignedUrl()
```

Storage

```
avatars/

cv/

templates/

reports/
```

---

# BullMQ

```
bullmq

├── queues
├── producers
└── workers
```

Queues

```
cv-review.queue.ts

answer-review.queue.ts

report-generation.queue.ts

learning-path.queue.ts
```

Responsibilities

```
Background Processing

Async AI Tasks

Heavy Jobs
```

---

# AI Providers

```
ai-providers

├── gemini.provider.ts

├── openai.provider.ts

├── ai.factory.ts

└── ai.module.ts
```

Responsibilities

```
Review CV

Review Answer

Generate Feedback

Generate Learning Path

Generate Reports
```

---

# Logger

```
logger

├── logger.module.ts

├── logger.service.ts

├── logger.interceptor.ts

└── pino.config.ts
```

Responsibilities

```
Request Logs

Error Logs

Audit Logs

Application Logs
```

Methods

```
info()

warn()

error()

debug()
```

---

# Monitoring

```
monitoring

├── monitoring.module.ts

├── metrics.service.ts

├── performance.interceptor.ts

├── health.controller.ts

└── health.service.ts
```

Metrics

```
API Response Time

Slow Queries

Redis Usage

AI Latency

Memory Usage

CPU Usage

Queue Metrics
```

---

# Tracing

```
tracing

├── tracing.module.ts

├── correlation.interceptor.ts

└── request-context.service.ts
```

Track

```
requestId

userId

sessionId

jobId
```

---

# Background Jobs

```
jobs

├── cv-review
├── answer-review
├── report-generation
└── learning-path
```

Ví dụ

```
cv-review

├── cv-review.job.ts

├── cv-review.processor.ts

└── cv-review.consumer.ts
```

---

# Shared Layer

```
shared

├── constants
├── decorators
├── dto
├── enums
├── exceptions
├── filters
├── guards
├── interceptors
├── pipes
├── validators
├── contracts
├── interfaces
├── helpers
├── types
└── utils
```

---

# Validators

```
validators

├── date.validator.ts

├── image-url.validator.ts

├── github.validator.ts

├── linkedin.validator.ts

├── phone.validator.ts

├── password.validator.ts

└── file.validator.ts
```

---

# Guards

```
guards

├── jwt-auth.guard.ts

├── roles.guard.ts

├── throttler.guard.ts

└── permission.guard.ts
```

---

# Filters

```
filters

├── global-exception.filter.ts

└── prisma-exception.filter.ts
```

---

# Interceptors

```
interceptors

├── response.interceptor.ts

├── logging.interceptor.ts

├── performance.interceptor.ts

└── transform.interceptor.ts
```

---

# Config

```
config

├── app.config.ts

├── database.config.ts

├── redis.config.ts

├── minio.config.ts

├── jwt.config.ts

├── ai.config.ts

├── queue.config.ts

└── logger.config.ts
```

---

# Dependency Rule

```
Presentation
        ↓

Application
        ↓

Domain
        ↓

Repository Contract
        ↓

Infrastructure
```

Không được phép:

```
Domain → Prisma

Domain → NestJS

Domain → Redis

Domain → MinIO

Domain → BullMQ

Domain → OpenAI
```

---

# Request Flow

```
Client

↓

Controller

↓

DTO Validation

↓

UseCase

↓

Domain Service

↓

Repository Contract

↓

Repository Implementation

↓

MySQL
```

---

# CV Review Flow

```
Client

↓

ReviewCVController

↓

ReviewCVUseCase

↓

BullMQ Producer

↓

Queue

↓

Worker

↓

MinIO

↓

Gemini/OpenAI

↓

MySQL
```

---

# Architecture Rules

1. Controller không chứa business logic.
2. UseCase chỉ điều phối nghiệp vụ.
3. Domain chứa toàn bộ business rules.
4. Repository chỉ truy cập dữ liệu.
5. Prisma chỉ nằm trong Infrastructure.
6. Redis chỉ truy cập qua CacheService.
7. MinIO chỉ truy cập qua StorageService.
8. AI chỉ truy cập qua AIService.
9. AI Tasks phải chạy qua BullMQ.
10. Domain không phụ thuộc Framework.
11. Một Use Case tương ứng một file.
12. Một Module tương ứng một Business Domain.
13. Infrastructure chỉ implement Contract.
14. Dependency luôn hướng vào Domain.
15. Không inject Repository Implementation vào Domain.