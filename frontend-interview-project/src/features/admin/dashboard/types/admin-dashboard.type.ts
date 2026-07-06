export type AdminStat = {
  label: string;
  value: string;
  description: string;
};

export type LoginActivity = {
  day: string;
  logins: number;
  newUsers: number;
};

export type RoleDistribution = {
  role: "USER" | "ADMIN";
  count: number;
};

export type RecentActivity = {
  id: string;
  user: string;
  action: string;
  time: string;
  status: "success" | "warning" | "failed";
};

export type QuickAction = {
  label: string;
  description: string;
  href: string;
};
