import type { InterviewHistoryStatus } from '../types/interview-history.type';
import styles from './interview-history.module.css';
const labels = { PENDING: 'Chưa bắt đầu', IN_PROGRESS: 'Đang thực hiện', COMPLETED: 'Đã hoàn thành', CANCELLED: 'Đã hủy' };
const classes = { PENDING: styles.pending, IN_PROGRESS: styles.progress, COMPLETED: styles.completed, CANCELLED: styles.cancelled };
export function InterviewHistoryStatusBadge({ status }: { status: InterviewHistoryStatus }) { return <span className={`${styles.badge} ${classes[status]}`}>{labels[status]}</span>; }
