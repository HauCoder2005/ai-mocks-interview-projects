"use client";

import Link from 'next/link';
import { useState } from 'react';
import { candidateInterviewSessionService } from '@/lib/api/services/interview/candidate-interview-session';
import type { InterviewHistoryItem } from '../types/interview-history.type';
import { InterviewHistoryStatusBadge } from './interview-history-status-badge';
import styles from './interview-history.module.css';
export function InterviewHistoryCard({ item, onCancelled }: { item: InterviewHistoryItem; onCancelled: () => void | Promise<void> }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const href = item.status === 'PENDING' || item.status === 'IN_PROGRESS' ? `/interview/sessions/${item.sessionId}` : `/interviews/${item.sessionId}`;
  const action = item.status === 'PENDING' ? 'Bắt đầu' : item.status === 'IN_PROGRESS' ? 'Tiếp tục' : item.status === 'COMPLETED' ? 'Xem kết quả' : 'Xem chi tiết';
  const canCancel = item.status === 'PENDING' || item.status === 'IN_PROGRESS';
  const cancel = async () => {
    if (isCancelling || !window.confirm('Bạn có chắc muốn hủy phiên phỏng vấn này không? Phiên sẽ được lưu trong lịch sử với trạng thái Đã hủy.')) return;
    setIsCancelling(true); setCancelError('');
    try { await candidateInterviewSessionService.cancelSession(item.sessionId); await onCancelled(); }
    catch (error) { setCancelError(error instanceof Error ? error.message : 'Không thể hủy phiên phỏng vấn.'); }
    finally { setIsCancelling(false); }
  };
  return <article className={styles.card}><div className={styles.cardHeader}><div><h2>{item.title}</h2><div className={styles.meta}><span>{item.position.name}</span><span>·</span><span>{item.level.name}</span><span>·</span><span>Lần {item.attemptNumber}</span></div></div><InterviewHistoryStatusBadge status={item.status}/></div><div className={styles.meta}>{item.technologies.map((technology)=><span key={technology.id}>{technology.name}</span>)}</div><div className={styles.stats}><div className={styles.stat}><span>Tiến độ</span><strong>{item.answeredQuestionCount}/{item.questionCount} câu</strong></div><div className={styles.stat}><span>Thời lượng</span><strong>{item.durationMinutes} phút</strong></div><div className={styles.stat}><span>Điểm</span><strong>{item.overallScore ?? '--'}</strong></div><div className={styles.stat}><span>Ngày tạo</span><strong>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</strong></div></div>{cancelError ? <p className={styles.inlineError} role="alert">{cancelError}</p> : null}<div className={styles.actions}>{canCancel ? <button className={styles.cancelButton} disabled={isCancelling} onClick={cancel} type="button">{isCancelling ? 'Đang hủy...' : 'Hủy phiên'}</button> : null}<Link className={styles.button} href={href}>{action}</Link></div></article>;
}
