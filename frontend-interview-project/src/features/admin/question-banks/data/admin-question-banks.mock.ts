import type { AdminQuestion } from "../types/admin-question-bank.type";

export const adminQuestionsMock: AdminQuestion[] = [
  {
    id: "q-1",
    question: "Explain how NestJS dependency injection works.",
    expectedAnswer: "Mention providers, modules, constructor injection and testing benefits.",
    position: "Backend Developer",
    level: "Junior",
    type: "Technical",
    topic: "NestJS",
    status: "Active",
    updatedAt: "2026-07-01",
  },
  {
    id: "q-2",
    question: "How would you optimize a React page with slow rendering?",
    expectedAnswer: "Discuss memoization, state boundaries, profiling and data loading.",
    position: "Frontend Developer",
    level: "Middle",
    type: "Technical",
    topic: "React",
    status: "Active",
    updatedAt: "2026-06-29",
  },
  {
    id: "q-3",
    question: "Tell me about a time you handled disagreement in a team.",
    expectedAnswer: "Use STAR, show listening, tradeoffs and outcome.",
    position: "Fullstack Developer",
    level: "Junior",
    type: "Behavioral",
    topic: "Communication",
    status: "Active",
    updatedAt: "2026-06-25",
  },
  {
    id: "q-4",
    question: "What are common Docker image optimization techniques?",
    expectedAnswer: "Mention multi-stage builds, small base images and cache layers.",
    position: "DevOps",
    level: "Middle",
    type: "Technical",
    topic: "Docker",
    status: "Inactive",
    updatedAt: "2026-06-18",
  },
];

export const questionPositions = [
  "All",
  "Backend Developer",
  "Frontend Developer",
  "Fullstack Developer",
  "DevOps",
];

export const questionLevels = ["All", "Intern", "Fresher", "Junior", "Middle", "Senior"];
export const questionTypes = ["All", "Technical", "Behavioral", "Mixed"];
export const questionTopics = ["All", "NestJS", "React", "Communication", "Docker"];
