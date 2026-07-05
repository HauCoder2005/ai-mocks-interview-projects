import Link from "next/link";
import { Bot } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import styles from "@/features/user/interview/components/simple-user-pages.module.css";

export default function UserInterviewsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Phiên của tôi</p>
          <h1 className={styles.title}>Lịch sử phỏng vấn</h1>
          <p className={styles.subtitle}>Khi backend có dữ liệu phiên, danh sách và kết quả sẽ hiển thị tại đây.</p>
        </div>
        <Link className={styles.button} href="/interview/setup">
          <Bot size={17} />
          Tạo phiên mới
        </Link>
      </header>

      <EmptyState
        title="Chưa có phiên phỏng vấn"
        description="Bắt đầu một phiên AI để lưu lịch sử, điểm số và góp ý."
        action={
          <Link className={styles.button} href="/interview/setup">
            Phỏng vấn với AI
          </Link>
        }
      />
    </div>
  );
}
