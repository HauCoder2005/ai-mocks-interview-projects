export const appConfig = {
  name: "AI Mock Interview Platform",
  description:
    "Practice realistic AI-powered mock interviews, manage question banks, and prepare candidates at scale.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080/api",
};
