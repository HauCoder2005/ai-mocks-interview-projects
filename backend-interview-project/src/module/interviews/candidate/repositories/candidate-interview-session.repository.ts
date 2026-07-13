import { Injectable } from '@nestjs/common';
import {
  interview_configurations,
  interview_configurations_interview_type,
  interview_levels,
  interview_positions,
  Prisma,
  interview_sessions,
  interview_sessions_status,
} from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';
import { ACTIVE_SESSION_STATUSES } from '../constants/active-interview-session-statuses.constant';

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
        status: interview_sessions_status.PENDING,
        started_at: null,
        updated_at: new Date(),
      },
    });
  }

  async createPendingSessionWithNextAttempt(params: {
    userId: number;
    configurationId: number;
  }): Promise<interview_sessions> {
    return this.prismaService.$transaction(async (tx) => {
      const latest = await tx.interview_sessions.findFirst({
        where: {
          user_id: params.userId,
          configuration_id: params.configurationId,
        },
        orderBy: { attempt_number: 'desc' },
        select: { attempt_number: true },
      });

      return tx.interview_sessions.create({
        data: {
          user_id: params.userId,
          configuration_id: params.configurationId,
          attempt_number: (latest?.attempt_number ?? 0) + 1,
          status: interview_sessions_status.PENDING,
          started_at: null,
        },
      });
    });
  }

  findActiveAiInterviewSessionByUserId(userId: number) {
    return this.prismaService.interview_sessions.findFirst({
      where: {
        user_id: userId,
        status: {
          in: ACTIVE_SESSION_STATUSES,
        },
        interview_configurations: { is: { user_id: userId } },
      },
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
    });
  }

  /**
   * The user row lock, active-session check and insert share one Serializable
   * transaction, so requests for one user cannot pass the check concurrently.
   */
  createPendingSessionIfNoActive(params: {
    userId: number;
    position: interview_positions;
    level: interview_levels;
  }) {
    return this.prismaService.$transaction(
      async (tx) => {
        // Lock one stable row per user. This makes check + create sequential for
        // the same JWT owner even when the active-session result set is empty.
        // Serializable alone cannot express this invariant as a unique index on
        // MariaDB because partial unique indexes are not supported.
        await tx.$queryRaw(
          Prisma.sql`SELECT id FROM users WHERE id = ${params.userId} FOR UPDATE`,
        );

        const activeSession = await tx.interview_sessions.findFirst({
          where: {
            user_id: params.userId,
            status: {
              in: ACTIVE_SESSION_STATUSES,
            },
            interview_configurations: { is: { user_id: params.userId } },
          },
          orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
        });

        if (activeSession) {
          return { created: false as const, activeSession };
        }

        let configuration = await tx.interview_configurations.findFirst({
          where: {
            user_id: params.userId,
            position_id: params.position.id,
            level_id: params.level.id,
          },
          orderBy: { id: 'desc' },
        });

        configuration ??= await tx.interview_configurations.create({
          data: {
            user_id: params.userId,
            position_id: params.position.id,
            level_id: params.level.id,
            name: `${params.position.name} - ${params.level.name}`,
            interview_type: interview_configurations_interview_type.MIXED,
            question_count: 5,
            duration_minutes: 30,
            description: null,
          },
        });

        const latest = await tx.interview_sessions.findFirst({
          where: {
            user_id: params.userId,
            configuration_id: configuration.id,
          },
          orderBy: { attempt_number: 'desc' },
          select: { attempt_number: true },
        });
        const session = await tx.interview_sessions.create({
          data: {
            user_id: params.userId,
            configuration_id: configuration.id,
            attempt_number: (latest?.attempt_number ?? 0) + 1,
            status: interview_sessions_status.PENDING,
            started_at: null,
          },
        });

        return { created: true as const, session, configuration };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
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
