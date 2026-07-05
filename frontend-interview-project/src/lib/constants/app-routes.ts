export const appRoutes = {
  home: "/",
  login: "/login",
  register: "/register",
  userDashboard: "/dashboard",
  userInterview: "/interview",
  userInterviewSetup: "/interview/setup",
  userInterviews: "/interviews",
  userPractice: "/practice",
  mockTests: "/mock-tests",
  mockTestDetail: (slug: string) => `/mock-tests/${slug}`,
  mockTestAttempt: (attemptId: number | string) =>
    `/mock-tests/attempts/${attemptId}`,
  mockTestResult: (attemptId: number | string) =>
    `/mock-tests/attempts/${attemptId}/result`,
  userJobs: "/jobs",
  userResumes: "/resumes",
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminQuestionBanks: "/admin/question-banks",
  adminInterviewOptions: "/admin/interview-options",
  adminUsers: "/admin/users",
};
