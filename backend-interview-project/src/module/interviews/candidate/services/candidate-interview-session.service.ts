import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  interview_configurations,
  interview_levels,
  interview_positions,
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
    const [position, level] = await Promise.all([
      this.getActivePosition(dto.positionId),
      this.getActiveLevel(dto.levelId),
    ]);

    const configuration = await this.getOrCreateConfiguration({
      userId,
      position,
      level,
    });
    const latestAttempt = await this.sessionRepository.findLatestAttempt({
      userId,
      configurationId: configuration.id,
    });
    const attemptNumber = (latestAttempt?.attempt_number ?? 0) + 1;

    const session = await this.sessionRepository.createSession({
      userId,
      configurationId: configuration.id,
      attemptNumber,
    });

    this.logger.log(
      `Interview session started: userId=${userId}, sessionId=${session.id}`,
    );

    return {
      id: session.id,
      sessionId: session.id,
      configurationId: session.configuration_id,
      positionId: configuration.position_id,
      levelId: configuration.level_id,
      attemptNumber: session.attempt_number,
      status: session.status,
      startedAt: session.started_at ?? session.created_at,
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

  private async getOrCreateConfiguration(params: {
    userId: number;
    position: interview_positions;
    level: interview_levels;
  }): Promise<interview_configurations> {
    const existedConfiguration = await this.sessionRepository.findConfiguration(
      {
        userId: params.userId,
        positionId: params.position.id,
        levelId: params.level.id,
      },
    );

    if (existedConfiguration) {
      return existedConfiguration;
    }

    return this.sessionRepository.createDefaultConfiguration(params);
  }
}
