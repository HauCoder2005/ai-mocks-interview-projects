import styles from "../../shared/admin-ui.module.css";
import { AdminOptionGroupList } from "./admin-option-group-list";

export function AdminInterviewOptionsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Interview Options</h1>
          <p className={styles.subtitle}>
            Quản lý Positions, Experience levels, Interview types, Technical
            topics, Soft skill topics và Question count presets theo nhóm.
          </p>
        </div>
      </header>
      <AdminOptionGroupList />
    </div>
  );
}
