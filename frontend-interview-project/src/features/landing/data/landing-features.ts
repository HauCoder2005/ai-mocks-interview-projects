import {
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Mic,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react";

import type { LandingFeature } from "../types/landing.type";

export const interviewFlowFeatures: LandingFeature[] = [
  {
    title: "Chọn ngữ cảnh",
    description: "Bắt đầu với vị trí, cấp độ, công nghệ và chủ đề phù hợp.",
    icon: Settings2,
  },
  {
    title: "Trả lời bằng micro",
    description: "Ghi âm câu trả lời và để hệ thống chuyển thành transcript.",
    icon: Mic,
  },
  {
    title: "AI hỏi tiếp theo câu trả lời",
    description: "Agent bám sát nội dung bạn nói để hỏi sâu hơn.",
    icon: MessageSquareText,
  },
  {
    title: "Tổng kết sau phiên",
    description: "Điểm số và nhận xét được giữ lại để xây dựng màn hình tổng kết.",
    icon: BarChart3,
  },
];

export const howItWorksSteps: LandingFeature[] = [
  {
    title: "Chọn vị trí, cấp độ, công nghệ",
    description: "Thiết lập ngữ cảnh để phiên luyện tập không hỏi lan man.",
    icon: Target,
  },
  {
    title: "Trả lời bằng giọng nói hoặc văn bản",
    description: "Luyện khả năng diễn đạt như khi đang trao đổi với interviewer.",
    icon: Mic,
  },
  {
    title: "Nhận phản hồi và câu hỏi tiếp theo",
    description: "AI đưa góp ý tự nhiên và tiếp tục đào sâu theo câu trả lời.",
    icon: Bot,
  },
];

export const landingBenefits: LandingFeature[] = [
  {
    title: "Chuẩn bị có cấu trúc",
    description: "Đi từ kiến thức nền, luyện câu hỏi, đến phỏng vấn theo ngữ cảnh.",
    icon: ClipboardList,
  },
  {
    title: "Tập nói rõ ràng hơn",
    description: "Voice chat giúp bạn rèn phản xạ và cách trình bày thành lời.",
    icon: Sparkles,
  },
  {
    title: "Theo dõi tiến bộ",
    description: "Kết quả phiên có thể dùng làm nền cho dashboard tổng kết sau này.",
    icon: CheckCircle2,
  },
];
