import type { AdminUserRole, AdminUserStatus } from "../types/admin-user.type";
import styles from "../../shared/admin-ui.module.css";

export type AdminUserFilters = {
  keyword: string;
  role: "All" | AdminUserRole;
  status: "All" | AdminUserStatus;
};

type AdminUserFilterBarProps = {
  filters: AdminUserFilters;
  onChange: (filters: AdminUserFilters) => void;
  onCreate: () => void;
};

export function AdminUserFilterBar({
  filters,
  onChange,
  onCreate,
}: AdminUserFilterBarProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            className={styles.input}
            onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
            placeholder="Name or email"
            value={filters.keyword}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Role</span>
          <select
            className={styles.select}
            onChange={(event) =>
              onChange({ ...filters, role: event.target.value as AdminUserFilters["role"] })
            }
            value={filters.role}
          >
            <option>All</option>
            <option>User</option>
            <option>Admin</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Status</span>
          <select
            className={styles.select}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as AdminUserFilters["status"],
              })
            }
            value={filters.status}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Banned</option>
          </select>
        </label>
        <button className={styles.primaryButton} onClick={onCreate} type="button">
          Add user
        </button>
      </div>
    </section>
  );
}
