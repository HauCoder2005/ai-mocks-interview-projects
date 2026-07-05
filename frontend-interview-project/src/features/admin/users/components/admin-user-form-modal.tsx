"use client";

import { useState } from "react";

import { AdminModal } from "../../shared/admin-modal";
import type { AdminUser, AdminUserFormInput } from "../types/admin-user.type";
import styles from "../../shared/admin-ui.module.css";

type AdminUserFormModalProps = {
  user?: AdminUser;
  onClose: () => void;
  onSubmit: (input: AdminUserFormInput) => void;
};

export function AdminUserFormModal({
  onClose,
  onSubmit,
  user,
}: AdminUserFormModalProps) {
  const [form, setForm] = useState<AdminUserFormInput>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "User",
    status: user?.status ?? "Active",
  });

  return (
    <AdminModal
      description="Edit user identity, role and account status."
      footer={
        <button
          className={styles.primaryButton}
          onClick={() => onSubmit(form)}
          type="button"
        >
          Save
        </button>
      }
      onClose={onClose}
      title={user ? "Edit user" : "Add user"}
    >
      <label className={styles.field}>
        <span className={styles.label}>Name</span>
        <input
          className={styles.input}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          value={form.name}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          value={form.email}
        />
      </label>
      <div className={styles.twoColumn}>
        <label className={styles.field}>
          <span className={styles.label}>Role</span>
          <select
            className={styles.select}
            onChange={(event) =>
              setForm({ ...form, role: event.target.value as AdminUserFormInput["role"] })
            }
            value={form.role}
          >
            <option>User</option>
            <option>Admin</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Status</span>
          <select
            className={styles.select}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value as AdminUserFormInput["status"],
              })
            }
            value={form.status}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Banned</option>
          </select>
        </label>
      </div>
    </AdminModal>
  );
}
