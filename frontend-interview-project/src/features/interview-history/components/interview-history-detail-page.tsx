'use client';

import Link from 'next/link';
import { useInterviewHistoryDetail } from '../hooks/use-interview-history-detail';
import { InterviewHistoryStatusBadge } from './interview-history-status-badge';
import styles from './interview-history.module.css';

export function InterviewHistoryDetailPage({ sessionId }: { sessionId: string }) {
  const { data, loading, error } = useInterviewHistoryDetail(sessionId);

  if (loading) {
    return <main className={styles.page}><div className={styles.skeleton} /></main>;
  }
  if (error || !data) {
    return (
      <main className={styles.page}>
        <div className={styles.error} role="alert">
          Không thể tải chi tiết phiên phỏng vấn.
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Chi tiết phiên</p>
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.subtitle}>
            {data.position.name} · {data.level.name} · Lần {data.attemptNumber}
          </p>
        </div>
        <InterviewHistoryStatusBadge status={data.status} />
      </header>
      <div className={styles.stats}>
        <div className={styles.stat}><span>Số câu</span><strong>{data.answeredQuestionCount}/{data.questionCount}</strong></div>
        <div className={styles.stat}><span>Thời gian</span><strong>{data.durationSeconds ?? '--'} giây</strong></div>
        <div className={styles.stat}><span>Điểm</span><strong>{data.overallScore ?? '--'}</strong></div>
        <div className={styles.stat}><span>Ngày tạo</span><strong>{new Date(data.createdAt).toLocaleDateString('vi-VN')}</strong></div>
      </div>
      <section className={styles.list}>
        {data.questions.map((question) => (
          <article className={styles.card} key={question.sessionQuestionId}>
            <h2>Câu {question.displayOrder}</h2>
            <p>{question.content}</p>
            <p>{question.answer?.answerText ?? 'Chưa trả lời'}</p>
            {question.review ? <p>{question.review.feedback}</p> : null}
          </article>
        ))}
      </section>
      {data.report ? (
        <article className={styles.card}>
          <h2>Báo cáo</h2>
          <p>{data.report.recommendations ?? data.report.strengths ?? 'Chưa có nhận xét.'}</p>
        </article>
      ) : null}
      <div><Link className={styles.button} href="/interviews">Quay lại lịch sử</Link></div>
    </main>
  );
}
