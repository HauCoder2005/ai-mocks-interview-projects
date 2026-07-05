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
                  <button className={styles.ghostButton} type="button">
                    View
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => onEdit(user)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => onToggleStatus(user)}
                    type="button"
                  >
                    {user.status === "Active" ? "Disable" : "Enable"}
                  </button>
                  <button
                    className={styles.dangerButton}
                    onClick={() => onDelete(user)}
                    type="button"
                  >
                    Delete
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
