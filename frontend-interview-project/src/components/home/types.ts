import type React from "react";

/**
 * Describes a product capability rendered on the landing page.
 */
export type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
};

/**
 * Describes a prepared mock interview card shown to candidates.
 */
export type InterviewCard = {
  title: string;
  description: string;
  level: string;
  icon: React.ReactNode;
};
