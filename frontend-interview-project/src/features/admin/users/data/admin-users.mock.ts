import type { AdminUser } from "../types/admin-user.type";

export const adminUsersMock: AdminUser[] = [
  {
    id: "user-1",
    name: "An Nguyen",
    email: "an.nguyen@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2026-07-03 09:10",
    createdAt: "2026-05-12",
  },
  {
    id: "user-2",
    name: "Mai Tran",
    email: "mai.tran@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-07-03 08:45",
    createdAt: "2026-04-20",
  },
  {
    id: "user-3",
    name: "Khoa Le",
    email: "khoa.le@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2026-06-26 13:20",
    createdAt: "2026-03-08",
  },
  {
    id: "user-4",
    name: "Linh Pham",
    email: "linh.pham@example.com",
    role: "User",
    status: "Banned",
    lastLogin: "2026-06-18 11:05",
    createdAt: "2026-02-14",
  },
];
