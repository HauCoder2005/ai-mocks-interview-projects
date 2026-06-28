import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import styles from "./admin-users-page.module.css";

export function AdminUsersPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Users"
        description="Manage administrators and candidates when backend user APIs are connected."
      />
      <EmptyState
        title="No users loaded"
        description="This feature page is intentionally separate from app routing for future API integration."
      />
    </div>
  );
}
