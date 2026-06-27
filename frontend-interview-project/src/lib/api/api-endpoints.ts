export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    google: "/auth/google",
    me: "/auth/me",
  },
  admin: {
    positions: "/admin/interview-options/positions",
    levels: "/admin/interview-options/levels",
    technologies: "/admin/interview-options/technologies",
    topics: "/admin/interview-options/topics",
    questionBanks: "/admin/question-banks",
    users: "/admin/users",
  },
  candidate: {
    interviewConfiguration: "/candidate/interview-configuration",
    mockInterview: "/candidate/mock-interview",
    interviewHistory: "/candidate/interview-history",
  },
};
