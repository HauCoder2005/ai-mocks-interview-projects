import { Injectable } from '@nestjs/common';
import {
  interview_configurations,
  interview_configurations_interview_type,
  interview_levels,
  interview_positions,
  interview_sessions,
  interview_sessions_status,
} from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';

@Injectable()
export class CandidateInterviewSessionRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.interview_sessions);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  selectMany(query?: any): Promise<any[]> {
    return this.executeSelectMany(query);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }

  /*
   * Method bắt buộc do AbstractPrismaCrudService yêu cầu.
   */
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  async findActivePositionById(
    id: number,
  ): Promise<interview_positions | null> {
    return this.prismaService.interview_positions.findFirst({
      where: {
        id,
        is_active: true,
      },
    });
  }

  async findActiveLevelById(id: number): Promise<interview_levels | null> {
    return this.prismaService.interview_levels.findFirst({
      where: {
        id,
        is_active: true,
      },
    });
  }

  async findConfiguration(params: {
    userId: number;
    positionId: number;
    levelId: number;
  }): Promise<interview_configurations | null> {
    return this.prismaService.interview_configurations.findFirst({
      where: {
        user_id: params.userId,
        position_id: params.positionId,
        level_id: params.levelId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async createDefaultConfiguration(params: {
    userId: number;
    position: interview_positions;
    level: interview_levels;
  }): Promise<interview_configurations> {
    return this.prismaService.interview_configurations.create({
      data: {
        user_id: params.userId,
        position_id: params.position.id,
        level_id: params.level.id,
        name: `${params.position.name} - ${params.level.name}`,
        interview_type: interview_configurations_interview_type.MIXED,
        question_count: 5,
        duration_minutes: 30,
        description: null,
        updated_at: new Date(),
      },
    });
  }

  async findLatestAttempt(params: {
    userId: number;
    configurationId: number;
  }): Promise<interview_sessions | null> {
    return this.prismaService.interview_sessions.findFirst({
      where: {
        user_id: params.userId,
        configuration_id: params.configurationId,
      },
      orderBy: {
        attempt_number: 'desc',
      },
    });
  }

  async createSession(params: {
    userId: number;
    configurationId: number;
    attemptNumber: number;
  }): Promise<interview_sessions> {
    return this.prismaService.interview_sessions.create({
      data: {
        user_id: params.userId,
        configuration_id: params.configurationId,
        attempt_number: params.attemptNumber,
        status: interview_sessions_status.IN_PROGRESS,
        started_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findInProgressSessionByIdAndUserId(params: {
    sessionId: number;
    userId: number;
  }): Promise<interview_sessions | null> {
    return this.prismaService.interview_sessions.findFirst({
      where: {
        id: params.sessionId,
        user_id: params.userId,
        status: interview_sessions_status.IN_PROGRESS,
      },
    });
  }

  async findEvaluationContext(params: {
    sessionId: number;
    userId: number;
  }): Promise<any | null> {
    return this.prismaService.interview_sessions.findFirst({
      where: {
        id: params.sessionId,
        user_id: params.userId,
        status: interview_sessions_status.IN_PROGRESS,
      },
      include: {
        interview_configurations: {
          include: {
            interview_positions: true,
            interview_levels: true,
            interview_configuration_topics: {
              include: {
                interview_topics: true,
              },
            },
          },
        },
        interview_session_questions: {
          orderBy: {
            display_order: 'asc',
          },
          include: {
            interview_answers: {
              where: {
                user_id: params.userId,
              },
              orderBy: {
                created_at: 'asc',
              },
            },
          },
        },
      },
    });
  }
}
