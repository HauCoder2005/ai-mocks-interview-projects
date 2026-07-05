import type { LucideIcon } from "lucide-react";

export type LandingCategory = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type LandingFilterOption = {
  label: string;
  value: string;
};

export type LandingSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
};

export type LandingExamCard = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  level: string;
  icon: LucideIcon;
};

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};
