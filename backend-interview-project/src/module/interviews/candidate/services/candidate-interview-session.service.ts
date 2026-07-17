import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  interview_levels,
  interview_positions,
  interview_sessions,
} from 'generated/prisma/client';
import { StartCandidateInterviewSessionDto } from '../dtos/start-candidate-interview-session.dto';
import { CandidateInterviewSessionRepository } from '../repositories/candidate-interview-session.repository';
import { CandidateInterviewSessionResult } from '../results/interview-session/candidate-interview-session-result';

@Injectable()
export class CandidateInterviewSessionService {
  private readonly logger = new Logger(CandidateInterviewSessionService.name);

  constructor(
    private readonly sessionRepository: CandidateInterviewSessionRepository,
  ) {}

  /**
   * Tạo phiên phỏng vấn mới để Candidate bắt đầu flow trả lời bằng text hoặc voice.
   */
  async startInterviewSession(
    userId: number,
    dto: StartCandidateInterviewSessionDto,
  ): Promise<CandidateInterviewSessionResult> {
    const existingSession =
      await this.sessionRepository.findActiveAiInterviewSessionByUserId(userId);
    if (existingSession) this.throwActiveSessionConflict(existingSession);

    const [position, level] = await Promise.all([
      this.getActivePosition(dto.positionId),
      this.getActiveLevel(dto.levelId),
    ]);

    const creation = await this.createSessionWithConcurrencyGuard({
      userId,
      position,
      level,
    });
    if (!creation.created) {
      this.throwActiveSessionConflict(creation.activeSession);
    }

    const { configuration, session } = creation;

    this.logger.log(
      `Interview session created as pending: userId=${userId}, sessionId=${session.id}`,
    );

    return {
      id: session.id,
      sessionId: session.id,
      configurationId: session.configuration_id,
      positionId: configuration.position_id,
      levelId: configuration.level_id,
      attemptNumber: session.attempt_number,
      status: session.status,
      startedAt: session.started_at,
    };
  }

  private async getActivePosition(
    positionId: number,
  ): Promise<interview_positions> {
    const position =
      await this.sessionRepository.findActivePositionById(positionId);

    if (!position) {
      throw new NotFoundException('Interview position not found or inactive');
    }

    return position;
  }

  private async getActiveLevel(levelId: number): Promise<interview_levels> {
    const level = await this.sessionRepository.findActiveLevelById(levelId);

    if (!level) {
      throw new NotFoundException('Interview level not found or inactive');
    }

    return level;
  }

  private async createSessionWithConcurrencyGuard(params: {
    userId: number;
    position: interview_positions;
    level: interview_levels;
  }) {
    try {
      return await this.sessionRepository.createPendingSessionIfNoActive(
        params,
      );
    } catch (error) {
      if (!this.isTransactionConflict(error)) throw error;

      const activeSession =
        await this.sessionRepository.findActiveAiInterviewSessionByUserId(
          params.userId,
        );
      if (activeSession) this.throwActiveSessionConflict(activeSession);

      // A deadlock can be selected before the competing request commits.
      // One bounded retry keeps the endpoint deterministic without looping.
      return this.sessionRepository.createPendingSessionIfNoActive(params);
    }
  }

  private isTransactionConflict(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2034'
    );
  }

  private throwActiveSessionConflict(session: interview_sessions): never {
    throw new ConflictException({
      code: 'ACTIVE_INTERVIEW_SESSION_EXISTS',
      message:
        'Bạn đang có một phiên phỏng vấn chưa hoàn thành. Vui lòng tiếp tục hoặc hủy phiên hiện tại trước khi tạo phiên mới.',
      data: {
        sessionId: session.id,
        status: session.status,
        configurationId: session.configuration_id,
        createdAt: session.created_at,
        startedAt: session.started_at,
        canResume: true,
      },
    });
  }
}
