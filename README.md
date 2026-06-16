<div align="center">

<img src="./docs/images/logo.png" width="400" alt="AI Mock Interview"/>

# AI Mock Interview Platform

AI-powered interview preparation platform designed for software engineering students, freshers, and junior developers.

Practice technical interviews, receive AI-generated feedback, improve CV quality, and prepare for real-world recruitment processes.

<br>

<img src="https://img.shields.io/badge/Status-Development-blue" />
<img src="https://img.shields.io/badge/Backend-NestJS-red" />
<img src="https://img.shields.io/badge/Database-MySQL-orange" />
<img src="https://img.shields.io/badge/ORM-Prisma-2D3748" />
<img src="https://img.shields.io/badge/Cache-Redis-red" />
<img src="https://img.shields.io/badge/Storage-MinIO-green" />
<img src="https://img.shields.io/badge/License-MIT-success" />

</div>

---

# About The Project

Preparing for software engineering interviews is difficult for many students and junior developers.

Common challenges include:

- Lack of real interview experience
- Unclear assessment of technical skills
- Poor CV quality
- Difficulty identifying weaknesses
- Limited access to personalized feedback

AI Mock Interview Platform aims to solve these problems by providing an AI-powered environment where users can:

- Simulate real interview sessions
- Receive instant interview feedback
- Analyze strengths and weaknesses
- Improve interview performance
- Review and optimize CVs
- Generate ATS-friendly resumes
- Explore suitable job opportunities

---

# Main Features

## Authentication & User Management

- User Registration
- Login & Logout
- JWT Authentication
- Refresh Token
- Role-Based Access Control
- Profile Management

---

## AI Mock Interview

Create interview sessions based on:

- Position
- Experience Level
- Programming Language
- Framework
- Technology Stack

Supported interview tracks:

- Backend Developer
- Frontend Developer
- Fullstack Developer
- Mobile Developer
- QA Engineer
- DevOps Engineer
- Data Analyst

---

## Interview Evaluation

After completing an interview session, the system generates:

- Technical Score
- Communication Score
- Problem Solving Score
- Strength Analysis
- Weakness Analysis
- Personalized Improvement Suggestions

Example:

```text
Backend Intern      → Ready
Backend Fresher     → Needs Improvement
Backend Junior      → Not Ready
```

---

## Question Bank

Question categories:

- JavaScript
- TypeScript
- Node.js
- NestJS
- ReactJS
- Angular
- VueJS
- SQL
- MySQL
- PostgreSQL
- Redis
- Docker
- System Design
- Data Structures & Algorithms

---

## CV Review

Upload CV and receive:

- ATS Compatibility Score
- Structure Analysis
- Keyword Analysis
- Skill Gap Detection
- Improvement Suggestions

---

## CV Builder

Generate professional resumes using predefined templates.

Templates:

- Internship
- Fresher
- Junior Developer
- Backend Developer
- Frontend Developer
- Fullstack Developer

---

## Job Aggregator

Browse jobs using advanced filters:

- Position
- Technology
- Experience Level
- Salary Range
- Location

---

# System Architecture

The project follows:

```text
Feature-Based Clean Architecture
+
DDD Lite
+
Vertical Slice Architecture
```

---

# Project Structure

```text
src

├── modules
│
│   ├── ai
│   ├── auth
│   ├── users
│   ├── interviews
│   ├── question-bank
│   ├── cv
│   ├── reports
│   └── storage
│
├── infrastructure
│
│   ├── database
│   ├── cache
│   ├── storage
│   ├── logger
│   ├── monitoring
│   ├── queue
│   └── tracing
│
├── shared
├── config
│
├── app.module.ts
└── main.ts
```

---

# Technology Stack

## Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| NestJS     | Backend Framework       |
| TypeScript | Programming Language    |
| Prisma ORM | Database Access Layer   |
| MySQL      | Relational Database     |
| Redis      | Caching & Queue Support |
| MinIO      | Object Storage          |
| JWT        | Authentication          |
| Docker     | Containerization        |

---

## AI & Processing

| Technology         | Purpose              |
| ------------------ | -------------------- |
| OpenAI API         | Interview Evaluation |
| Prompt Engineering | Question Generation  |
| AI Analysis        | CV Review            |

---

## Infrastructure

| Technology     | Purpose              |
| -------------- | -------------------- |
| Docker Compose | Local Infrastructure |
| Redis          | Cache Layer          |
| MinIO          | File Storage         |
| MySQL          | Persistent Data      |

---

# Development Setup

## Install Dependencies

```bash
npm install
```

## Start Infrastructure

```bash
docker compose up -d
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Development Server

```bash
npm run start:dev
```

---

# Development Roadmap

## Phase 1

- Authentication
- User Management
- Question Bank
- Interview Engine

## Phase 2

- AI Evaluation
- Reports
- CV Review
- CV Builder

## Phase 3

- Job Aggregator
- Learning Recommendations
- AI Interview Coach

## Phase 4

- Realtime Voice Interview
- Realtime AI Feedback
- Multi-Language Support

---

# License

MIT License
