import { appRoutes } from "@/lib/constants/app-routes";

import type {
  AdminStat,
  LoginActivity,
  QuickAction,
  RecentActivity,
  RoleDistribution,
} from "../types/admin-dashboard.type";

export const adminStats: AdminStat[] = [
  { label: "Tổng người dùng", value: "0", description: "Chờ dữ liệu từ backend" },
  { label: "Đang hoạt động", value: "0", description: "Người dùng hoạt động trong tháng" },
  { label: "Đăng nhập hôm nay", value: "0", description: "Lượt đăng nhập thành công" },
  { label: "Phiên phỏng vấn", value: "0", description: "Tổng phiên luyện tập" },
  { label: "Ngân hàng câu hỏi", value: "0", description: "Bộ câu hỏi đang quản lý" },
  { label: "Chủ đề", value: "0", description: "Nhóm chủ đề dùng chung" },
];

export const loginActivity: LoginActivity[] = [
  { day: "T2", logins: 0, newUsers: 0 },
  { day: "T3", logins: 0, newUsers: 0 },
  { day: "T4", logins: 0, newUsers: 0 },
  { day: "T5", logins: 0, newUsers: 0 },
  { day: "T6", logins: 0, newUsers: 0 },
  { day: "T7", logins: 0, newUsers: 0 },
  { day: "CN", logins: 0, newUsers: 0 },
];

export const roleDistribution: RoleDistribution[] = [
  { role: "USER", count: 0 },
  { role: "ADMIN", count: 0 },
];

export const recentActivities: RecentActivity[] = [];

export const quickActions: QuickAction[] = [
  { label: "Quản lý người dùng", description: "Tài khoản, vai trò và trạng thái", href: appRoutes.adminUsers },
  { label: "Ngân hàng câu hỏi", description: "Tổ chức câu hỏi phỏng vấn", href: appRoutes.adminQuestionBanks },
  { label: "Công nghệ", description: "Quản lý công nghệ phỏng vấn", href: appRoutes.adminInterviewTechnologies },
  { label: "Chủ đề", description: "Nhóm dữ liệu dùng chung", href: appRoutes.adminInterviewTopics },
];
