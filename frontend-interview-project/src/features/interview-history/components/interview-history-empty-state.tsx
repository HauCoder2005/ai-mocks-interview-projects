import { Bot } from 'lucide-react';
import Link from 'next/link';
import styles from './interview-history.module.css';

export function InterviewHistoryEmptyState() {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <Bot aria-hidden="true" size={28} />
      </span>
      <h2>Chưa có phiên phỏng vấn AI</h2>
      <p>
        Mỗi phiên phỏng vấn AI bạn tạo sẽ được lưu tại đây, kể cả phiên chưa
        bắt đầu hoặc chưa hoàn thành.
      </p>
      <Link className={styles.button} href="/interview/setup">
        Phỏng vấn với AI
      </Link>
    </div>
  );
}
