'use client';

import Link from 'next/link';
import { AlertTriangle, Bot, RotateCcw } from 'lucide-react';
import { useInterviewHistory } from '../hooks/use-interview-history';
import type { InterviewHistoryStatus } from '../types/interview-history.type';
import { InterviewHistoryEmptyState } from './interview-history-empty-state';
import { InterviewHistoryList } from './interview-history-list';
import { InterviewHistoryLoading } from './interview-history-loading';
import { InterviewHistoryPagination } from './interview-history-pagination';
import styles from './interview-history.module.css';

export function InterviewHistoryPage() {
  const history = useInterviewHistory();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Phiên của tôi</p>
          <h1 className={styles.title}>Lịch sử phỏng vấn</h1>
          <p className={styles.subtitle}>
            Theo dõi các phiên chưa bắt đầu, đang thực hiện và đã hoàn thành.
          </p>
        </div>
        <Link className={styles.button} href="/interview/setup">
          <Bot size={17} />
          Tạo phiên mới
        </Link>
      </header>

      <div className={styles.filter}>
        <select
          aria-label="Lọc theo trạng thái"
          onChange={(event) => {
            history.setStatus(
              event.target.value as InterviewHistoryStatus | '',
            );
            history.setPage(1);
          }}
          value={history.status}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chưa bắt đầu</option>
          <option value="IN_PROGRESS">Đang thực hiện</option>
          <option value="COMPLETED">Đã hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {history.loading ? <InterviewHistoryLoading /> : null}
      {!history.loading && history.error ? (
        <div className={styles.error} role="alert">
          <AlertTriangle aria-hidden="true" size={20} />
          <div>
            <strong>Không thể tải lịch sử phỏng vấn.</strong>
            <p>Vui lòng kiểm tra kết nối và thử lại.</p>
          </div>
          <button className={styles.retryButton} onClick={history.refetch} type="button">
            <RotateCcw aria-hidden="true" size={16} />
            Thử lại
          </button>
        </div>
      ) : null}
      {!history.loading && !history.error && !history.data.length ? (
        <InterviewHistoryEmptyState />
      ) : null}
      {!history.loading && !history.error && history.data.length ? (
        <InterviewHistoryList items={history.data} onCancelled={history.refetch} />
      ) : null}
      {!history.loading && !history.error && history.meta?.total ? (
        <InterviewHistoryPagination
          meta={history.meta}
          onChange={history.setPage}
          page={history.page}
        />
      ) : null}
    </main>
  );
}
