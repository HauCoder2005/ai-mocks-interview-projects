export type UserRole = "admin" | "candidate";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
