export type InterviewOptionType = "position" | "level" | "technology" | "topic";

export type AdminInterviewOption = {
  id: string;
  type: InterviewOptionType;
  name: string;
  code?: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
};
