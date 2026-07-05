import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import styles from "@/features/user/interview/components/simple-user-pages.module.css";

export default function UserResumesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Hồ sơ xin việc</p>
          <h1 className={styles.title}>Quản lý CV và hồ sơ</h1>
          <p className={styles.subtitle}>Khu vực này dùng để chuẩn bị hồ sơ trước khi luyện phỏng vấn theo vị trí.</p>
        </div>
        <Link className={styles.button} href="/interview/setup">
          <Sparkles size={17} />
          Phỏng vấn với AI
        </Link>
      </header>

      <EmptyState
        title="Chưa có hồ sơ"
        description="Khi có API hồ sơ, CV và thông tin ứng tuyển sẽ hiển thị tại đây."
        action={
          <Link className={styles.button} href="/dashboard">
            <FileText size={17} />
            Về dashboard
          </Link>
        }
      />
    </div>
  );
}
