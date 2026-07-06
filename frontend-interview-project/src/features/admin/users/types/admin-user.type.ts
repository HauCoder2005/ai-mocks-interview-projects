export type AdminUserRole = "User" | "Admin";
export type AdminUserStatus = "Active" | "Inactive" | "Banned";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  lastLogin: string;
  createdAt: string;
};

export type AdminUserFormInput = {
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
};
