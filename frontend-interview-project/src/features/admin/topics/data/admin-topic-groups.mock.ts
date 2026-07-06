import type { AdminTopicGroup } from "../types/admin-topic.type";

export const adminTopicGroupsMock: AdminTopicGroup[] = [
  {
    id: "positions",
    title: "Positions",
    description: "Job roles available for interview setup.",
    status: "Active",
    items: [
      { id: "pos-backend", name: "Backend Developer", code: "backend", description: "Server-side engineering role", status: "Active" },
      { id: "pos-frontend", name: "Frontend Developer", code: "frontend", description: "Client-side engineering role", status: "Active" },
      { id: "pos-fullstack", name: "Fullstack Developer", code: "fullstack", description: "End-to-end product engineer", status: "Active" },
      { id: "pos-devops", name: "DevOps", code: "devops", description: "Infrastructure and delivery role", status: "Active" },
      { id: "pos-mobile", name: "Mobile Developer", code: "mobile", description: "Mobile app engineering role", status: "Active" },
    ],
  },
  {
    id: "experience-levels",
    title: "Experience Levels",
    description: "Candidate seniority presets.",
    status: "Active",
    items: [
      { id: "level-intern", name: "Intern", code: "intern", description: "Entry training level", status: "Active" },
      { id: "level-fresher", name: "Fresher", code: "fresher", description: "New graduate level", status: "Active" },
      { id: "level-junior", name: "Junior", code: "junior", description: "1-2 years experience", status: "Active" },
      { id: "level-middle", name: "Middle", code: "middle", description: "Independent engineer", status: "Active" },
      { id: "level-senior", name: "Senior", code: "senior", description: "Senior ownership level", status: "Active" },
    ],
  },
  {
    id: "interview-types",
    title: "Interview Types",
    description: "Main interview flows.",
    status: "Active",
    items: [
      { id: "type-technical", name: "Technical", code: "technical", description: "Engineering knowledge questions", status: "Active" },
      { id: "type-behavioral", name: "Behavioral", code: "behavioral", description: "Work style and STAR answers", status: "Active" },
      { id: "type-mixed", name: "Mixed", code: "mixed", description: "Technical and behavioral blend", status: "Active" },
    ],
  },
  {
    id: "technical-topics",
    title: "Technical Topics",
    description: "Technology-focused interview topics.",
    status: "Active",
    items: [
      { id: "topic-nestjs", name: "NestJS", code: "nestjs", description: "NestJS backend framework", status: "Active" },
      { id: "topic-nextjs", name: "Next.js", code: "nextjs", description: "React fullstack framework", status: "Active" },
      { id: "topic-react", name: "React", code: "react", description: "UI library", status: "Active" },
      { id: "topic-nodejs", name: "Node.js", code: "nodejs", description: "JavaScript runtime", status: "Active" },
      { id: "topic-mysql", name: "MySQL", code: "mysql", description: "Relational database", status: "Active" },
      { id: "topic-prisma", name: "Prisma", code: "prisma", description: "TypeScript ORM", status: "Active" },
      { id: "topic-docker", name: "Docker", code: "docker", description: "Container platform", status: "Active" },
      { id: "topic-redis", name: "Redis", code: "redis", description: "Cache and queue backend", status: "Active" },
      { id: "topic-minio", name: "MinIO", code: "minio", description: "Object storage", status: "Active" },
    ],
  },
  {
    id: "soft-skill-topics",
    title: "Soft Skill Topics",
    description: "Behavioral and leadership topics.",
    status: "Active",
    items: [
      { id: "soft-teamwork", name: "Teamwork", code: "teamwork", description: "Collaboration examples", status: "Active" },
      { id: "soft-communication", name: "Communication", code: "communication", description: "Clear stakeholder communication", status: "Active" },
      { id: "soft-problem-solving", name: "Problem Solving", code: "problem-solving", description: "Structured problem solving", status: "Active" },
      { id: "soft-leadership", name: "Leadership", code: "leadership", description: "Leading initiatives", status: "Active" },
    ],
  },
  {
    id: "question-count-presets",
    title: "Question Count Presets",
    description: "Reusable interview length presets.",
    status: "Active",
    items: [
      { id: "count-5", name: "5 questions", code: "5", description: "Short practice session", status: "Active" },
      { id: "count-10", name: "10 questions", code: "10", description: "Standard mock interview", status: "Active" },
      { id: "count-15", name: "15 questions", code: "15", description: "Deep practice session", status: "Active" },
    ],
  },
];
