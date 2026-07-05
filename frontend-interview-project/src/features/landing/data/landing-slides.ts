import type { LandingSlide } from "../types/landing.type";

// Unsplash Source images are public remote images used as landing previews.
export const landingSlides: LandingSlide[] = [
  {
    id: "ai-dashboard",
    title: "Phản hồi theo ngữ cảnh",
    description:
      "AI theo sát vị trí, cấp độ và chủ đề bạn chọn để hỏi tiếp như một buổi phỏng vấn thật.",
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    badge: "AI Interview",
  },
  {
    id: "voice-session",
    title: "Luyện trả lời bằng giọng nói",
    description:
      "Ghi âm câu trả lời, chuyển transcript và nhận phản hồi ngay trong khung chat.",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    badge: "Voice Practice",
  },
  {
    id: "developer-practice",
    title: "Ôn nhanh kiến thức kỹ thuật",
    description:
      "Kết hợp trắc nghiệm nền tảng với phỏng vấn AI để chuẩn bị trước khi ứng tuyển.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    badge: "Developer Prep",
  },
];
