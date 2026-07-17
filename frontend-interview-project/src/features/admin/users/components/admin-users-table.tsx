import { CheckCircle, Eye, Pencil, Trash2, XCircle } from "lucide-react";

import type { AdminUser } from "../types/admin-user.type";
import styles from "../../shared/admin-ui.module.css";

type AdminUsersTableProps = {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
};

function badgeClass(status: AdminUser["status"]) {
  if (status === "Active") {
    return `${styles.badge} ${styles.success}`;
  }

  if (status === "Inactive") {
    return `${styles.badge} ${styles.warning}`;
  }

  return `${styles.badge} ${styles.danger}`;
}

export function AdminUsersTable({
  onDelete,
  onEdit,
  onToggleStatus,
  users,
}: AdminUsersTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last login</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={styles.badge}>{user.role}</span>
              </td>
              <td>
                <span className={badgeClass(user.status)}>{user.status}</span>
              </td>
              <td>{user.lastLogin}</td>
              <td>{user.createdAt}</td>
              <td>
                <div className={styles.buttonRow}>
                  <button
                    aria-label="Xem chi tiết"
                    className={`${styles.iconButton} ${styles.iconButtonNeutral}`}
                    title="Xem chi tiết"
                    type="button"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    aria-label="Sửa"
                    className={`${styles.iconButton} ${styles.iconButtonNeutral}`}
                    onClick={() => onEdit(user)}
                    title="Sửa"
                    type="button"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    aria-label={
                      user.status === "Active" ? "Vô hiệu hóa" : "Kích hoạt"
                    }
                    className={
                      user.status === "Active"
                        ? `${styles.iconButton} ${styles.iconButtonWarning}`
                        : `${styles.iconButton} ${styles.iconButtonSuccess}`
                    }
                    onClick={() => onToggleStatus(user)}
                    title={user.status === "Active" ? "Vô hiệu hóa" : "Kích hoạt"}
                    type="button"
                  >
                    {user.status === "Active" ? (
                      <XCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                  </button>
                  <button
                    aria-label="Xóa"
                    className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                    onClick={() => onDelete(user)}
                    title="Xóa"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
