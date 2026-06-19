import {
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  FileCheck2,
  Layers3,
  Mic2,
  Server,
} from "lucide-react";

import styles from "@/src/app/page.module.css";

import type { Feature, InterviewCard } from "./types";

/**
 * Landing page feature cards.
 */
export const features: Feature[] = [
  {
    title: "AI Interview",
    description:
      "Mô phỏng phỏng vấn bằng AI, phản hồi theo thời gian thực và gợi ý cách trả lời sắc bén hơn.",
    icon: <Mic2 size={30} strokeWidth={2.3} />,
    iconClassName: styles.featureIconInterview,
  },
  {
    title: "CV Review",
    description:
      "Phân tích CV theo vai trò ứng tuyển, chỉ ra điểm yếu và đề xuất cách trình bày chuyên nghiệp.",
    icon: <FileCheck2 size={30} strokeWidth={2.3} />,
    iconClassName: styles.featureIconCv,
  },
  {
    title: "Job Matching",
    description:
      "Gợi ý công việc phù hợp dựa trên kỹ năng, kinh nghiệm và mục tiêu phát triển nghề nghiệp.",
    icon: <BriefcaseBusiness size={30} strokeWidth={2.3} />,
    iconClassName: styles.featureIconJob,
  },
];

/**
 * Curated mock interview tracks displayed on the landing page.
 */
export const interviewCards: InterviewCard[] = [
  {
    title: "Frontend React",
    description:
      "Hooks, state management, rendering performance và UI architecture.",
    level: "Intermediate",
    icon: <Code2 size={28} strokeWidth={2.3} />,
  },
  {
    title: "Backend Nodejs",
    description:
      "REST API, auth, database design, queue và production readiness.",
    level: "Advanced",
    icon: <Server size={28} strokeWidth={2.3} />,
  },
  {
    title: "System Design",
    description:
      "Thiết kế hệ thống có scale, trade-off rõ ràng và khả năng vận hành.",
    level: "Senior",
    icon: <Layers3 size={28} strokeWidth={2.3} />,
  },
  {
    title: "Behavioral Fit",
    description:
      "STAR method, leadership signal, ownership và communication clarity.",
    level: "All levels",
    icon: <BrainCircuit size={28} strokeWidth={2.3} />,
  },
];
