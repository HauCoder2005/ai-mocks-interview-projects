import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { interview_sessions_status } from 'generated/prisma/client';
import { CandidateInterviewHistoryQueryDto } from '../dtos/candidate-interview-history-query.dto';
import { CandidateInterviewHistoryMapper } from '../mappers/candidate-interview-history.mapper';
import { CandidateInterviewHistoryRepository } from '../repositories/candidate-interview-history.repository';

@Injectable()
export class CandidateInterviewHistoryService {
  constructor(
    private readonly repository: CandidateInterviewHistoryRepository,
  ) {}

  /* Lấy danh sách lịch sử phiên phỏng vấn của người dùng hiện tại. */
  async getHistory(userId: number, query: CandidateInterviewHistoryQueryDto) {
    const [records, total] = await Promise.all([
      this.repository.findAiInterviewHistoryByUserId(userId, query),
      this.repository.countAiInterviewHistoryByUserId(userId, query),
    ]);
    return {
      data: records.map((record) =>
        CandidateInterviewHistoryMapper.toResponseDto(record),
      ),
      meta: {
        total,
        itemCount: records.length,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getActiveSession(userId: number) {
    const record =
      await this.repository.findActiveAiInterviewSessionByUserId(userId);
    return record
      ? CandidateInterviewHistoryMapper.toActiveSessionResponse(record)
      : null;
  }

  /* Lấy chi tiết một phiên và luôn giới hạn theo user hiện tại. */
  async getDetail(userId: number, sessionId: number) {
    const record = await this.repository.findAiInterviewHistoryDetailByUserId(
      sessionId,
      userId,
    );
    if (!record) throw new NotFoundException('Interview session not found');
    return CandidateInterviewHistoryMapper.toDetailResponseDto(record);
  }

  async start(userId: number, sessionId: number) {
    const session = await this.getOwnedSession(userId, sessionId);
    if (session.status === interview_sessions_status.IN_PROGRESS)
      return session;
    if (session.status !== interview_sessions_status.PENDING) {
      throw new ConflictException(
        'Only pending interview sessions can be started',
      );
    }
    const updated = await this.repository.startSession(
      sessionId,
      userId,
      session.started_at ?? new Date(),
    );
    if (updated.count === 1) return this.getOwnedSession(userId, sessionId);

    const current = await this.getOwnedSession(userId, sessionId);
    if (current.status === interview_sessions_status.IN_PROGRESS)
      return current;
    throw new ConflictException('Interview session can no longer be started');
  }

  async complete(userId: number, sessionId: number, overallScore?: number) {
    const session = await this.getOwnedSession(userId, sessionId);
    if (session.status === interview_sessions_status.COMPLETED) return session;
    if (
      session.status !== interview_sessions_status.IN_PROGRESS ||
      !session.started_at
    ) {
      throw new ConflictException(
        'Only in-progress interview sessions can be completed',
      );
    }
    const completedAt = new Date();
    const durationSeconds = Math.max(
      0,
      Math.floor((completedAt.getTime() - session.started_at.getTime()) / 1000),
    );
    const updated = await this.repository.completeSession(sessionId, userId, {
      completedAt,
      durationSeconds,
      overallScore,
    });
    if (updated.count === 1) return this.getOwnedSession(userId, sessionId);

    const current = await this.getOwnedSession(userId, sessionId);
    if (current.status === interview_sessions_status.COMPLETED) return current;
    throw new ConflictException('Interview session can no longer be completed');
  }

  async cancel(userId: number, sessionId: number) {
    const session = await this.getOwnedSession(userId, sessionId);
    if (session.status === interview_sessions_status.CANCELLED) return session;
    if (
      session.status !== interview_sessions_status.PENDING &&
      session.status !== interview_sessions_status.IN_PROGRESS
    ) {
      throw new ConflictException(
        'Completed interview sessions cannot be cancelled',
      );
    }
    const durationSeconds = session.started_at
      ? Math.max(
          0,
          Math.floor((Date.now() - session.started_at.getTime()) / 1000),
        )
      : null;
    const updated = await this.repository.cancelSession(
      sessionId,
      userId,
      durationSeconds,
    );
    if (updated.count === 1) return this.getOwnedSession(userId, sessionId);

    const current = await this.getOwnedSession(userId, sessionId);
    if (current.status === interview_sessions_status.CANCELLED) return current;
    throw new ConflictException('Interview session can no longer be cancelled');
  }

  private async getOwnedSession(userId: number, sessionId: number) {
    const session = await this.repository.findSessionByIdAndUserId(
      sessionId,
      userId,
    );
    if (!session) throw new NotFoundException('Interview session not found');
    return session;
  }
}
