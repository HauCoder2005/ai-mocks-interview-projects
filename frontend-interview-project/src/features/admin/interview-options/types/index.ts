export type InterviewOptionType = "position" | "level" | "technology" | "topic";

export type AdminInterviewOption = {
  id: string;
  type: InterviewOptionType;
  name: string;
  isActive: boolean;
};
