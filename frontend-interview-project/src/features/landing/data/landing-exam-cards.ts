import {
  Boxes,
  Code2,
  Database,
  FileCode2,
  Layers3,
  ServerCog,
} from "lucide-react";

import type { LandingExamCard } from "../types/landing.type";

export const landingExamCards: LandingExamCard[] = [
  {
    id: "javascript-basic",
    title: "JavaScript cơ bản",
    description: "Ôn lại scope, async, array method và các câu hỏi nền tảng.",
    questionCount: 25,
    duration: "20 phút",
    level: "Fresher",
    icon: FileCode2,
  },
  {
    id: "react-next",
    title: "React & Next.js",
    description: "Kiểm tra kiến thức component, hook, routing và rendering.",
    questionCount: 30,
    duration: "25 phút",
    level: "Junior",
    icon: Code2,
  },
  {
    id: "nestjs-backend",
    title: "NestJS Backend",
    description: "Module, provider, guard, interceptor và kiến trúc service.",
    questionCount: 28,
    duration: "25 phút",
    level: "Junior+",
    icon: ServerCog,
  },
  {
    id: "database-prisma",
    title: "Database & Prisma",
    description: "Quan hệ dữ liệu, transaction, indexing và ORM workflow.",
    questionCount: 24,
    duration: "20 phút",
    level: "Middle",
    icon: Database,
  },
  {
    id: "docker-basic",
    title: "Docker căn bản",
    description: "Image, container, compose, network và quy trình deploy đơn giản.",
    questionCount: 20,
    duration: "18 phút",
    level: "Fresher+",
    icon: Boxes,
  },
  {
    id: "system-design-intro",
    title: "System Design nhập môn",
    description: "Caching, queue, scale ngang và cách phân tích yêu cầu hệ thống.",
    questionCount: 18,
    duration: "22 phút",
    level: "Middle",
    icon: Layers3,
  },
];
