import Link from "next/link";
import { Briefcase, Search } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import styles from "@/features/user/interview/components/simple-user-pages.module.css";

export default function UserJobsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Công việc</p>
          <h1 className={styles.title}>Vị trí đang quan tâm</h1>
          <p className={styles.subtitle}>Khi có API việc làm hoặc dữ liệu vị trí, danh sách sẽ hiển thị tại đây.</p>
        </div>
        <Link className={styles.button} href="/interview/setup">
          <Briefcase size={17} />
          Luyện theo vị trí
        </Link>
      </header>

      <EmptyState
        title="Chưa có dữ liệu công việc"
        description="Kết nối API công việc hoặc chọn vị trí trong phần phỏng vấn để bắt đầu luyện tập."
        action={
          <Link className={styles.button} href="/interview">
            <Search size={17} />
            Xem dạng bài
          </Link>
        }
      />
    </div>
  );
}
