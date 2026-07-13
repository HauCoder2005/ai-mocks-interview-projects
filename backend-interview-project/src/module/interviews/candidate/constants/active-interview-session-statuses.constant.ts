import { interview_sessions_status } from 'generated/prisma/client';

export const ACTIVE_SESSION_STATUSES: interview_sessions_status[] = [
  interview_sessions_status.PENDING,
  interview_sessions_status.IN_PROGRESS,
];
