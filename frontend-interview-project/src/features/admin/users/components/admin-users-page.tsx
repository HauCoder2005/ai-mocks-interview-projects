"use client";

import { useMemo, useState } from "react";

import { ConfirmDialog } from "../../shared/confirm-dialog";
import styles from "../../shared/admin-ui.module.css";
import { adminUsersMock } from "../data/admin-users.mock";
import type { AdminUser, AdminUserFormInput } from "../types/admin-user.type";
import {
  AdminUserFilterBar,
  type AdminUserFilters,
} from "./admin-user-filter-bar";
import { AdminUserFormModal } from "./admin-user-form-modal";
import { AdminUsersTable } from "./admin-users-table";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsersMock);
  const [filters, setFilters] = useState<AdminUserFilters>({
    keyword: "",
    role: "All",
    status: "All",
  });
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | undefined>();

  const filteredUsers = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return users.filter((user) => {
      const keywordMatch =
        !keyword ||
        `${user.name} ${user.email}`.toLowerCase().includes(keyword);
      const roleMatch = filters.role === "All" || user.role === filters.role;
      const statusMatch =
        filters.status === "All" || user.status === filters.status;

      return keywordMatch && roleMatch && statusMatch;
    });
  }, [filters, users]);

  const handleCreate = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = (input: AdminUserFormInput) => {
    if (editingUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id ? { ...user, ...input } : user,
        ),
      );
    } else {
      setUsers((current) => [
        {
          ...input,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString().slice(0, 10),
          lastLogin: "Never",
        },
        ...current,
      ]);
    }

    setIsModalOpen(false);
    setEditingUser(undefined);
  };

  const handleDelete = () => {
    if (!deletingUser) {
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== deletingUser.id));
    setDeletingUser(undefined);
  };

  const handleToggleStatus = (target: AdminUser) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === target.id
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user,
      ),
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>
            Quản lý người sử dụng web, vai trò đăng nhập và trạng thái tài khoản.
          </p>
        </div>
      </header>

      <AdminUserFilterBar
        filters={filters}
        onChange={setFilters}
        onCreate={handleCreate}
      />
      <AdminUsersTable
        onDelete={setDeletingUser}
        onEdit={(user) => {
          setEditingUser(user);
          setIsModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        users={filteredUsers}
      />

      {isModalOpen ? (
        <AdminUserFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          user={editingUser}
        />
      ) : null}
      {deletingUser ? (
        <ConfirmDialog
          description={`Delete or disable ${deletingUser.name}? This mock action removes the row locally.`}
          onCancel={() => setDeletingUser(undefined)}
          onConfirm={handleDelete}
          title="Confirm user delete"
        />
      ) : null}
    </div>
  );
}
