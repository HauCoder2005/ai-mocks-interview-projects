import { Injectable } from '@nestjs/common';
import { interview_sessions_status, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { AbstractPrismaCrudService } from 'src/shared/abstracts/crud/abstract-prisma-crud.service';
import { CandidateInterviewHistoryQueryDto } from '../dtos/candidate-interview-history-query.dto';
import { ACTIVE_SESSION_STATUSES } from '../../constants/active-interview-session-statuses.constant';

@Injectable()
export class CandidateInterviewHistoryRepository extends AbstractPrismaCrudService<any> {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService.interview_sessions);
  }

  selectMany(query?: any): Promise<any[]> {
    return this.executeSelectMany(query);
  }
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  selectOne(where: any): Promise<any | null> {
    return this.executeSelectOne(where);
  }
  insertOne(data: any): Promise<any> {
    return this.executeInsertOne(data);
  }
  updateOne(where: any, data: any): Promise<any> {
    return this.executeUpdateOne(where, data);
  }
  deleteOne(where: any): Promise<any> {
    return this.executeDeleteOne(where);
  }

  private where(
    userId: number,
    query: CandidateInterviewHistoryQueryDto,
  ): Prisma.interview_sessionsWhereInput {
    return {
      user_id: userId,
      status: query.status,
      created_at:
        query.fromDate || query.toDate
          ? {
              gte: query.fromDate ? new Date(query.fromDate) : undefined,
              lte: query.toDate ? new Date(query.toDate) : undefined,
            }
          : undefined,
      // AI interview sessions always belong to an interview configuration.
      // Mock-test attempts live in `test_attempts` and are intentionally not
      // part of this repository.
      interview_configurations: {
        is: {
          user_id: userId,
          name: query.keyword ? { contains: query.keyword } : undefined,
        },
      },
    };
  }

  private configurationInclude() {
    return {
      interview_positions: true,
      interview_levels: true,
      interview_configuration_technologies: {
        include: { interview_technologies: true },
      },
      interview_configuration_topics: { include: { interview_topics: true } },
    };
  }

  async findAiInterviewHistoryByUserId(
    userId: number,
    query: CandidateInterviewHistoryQueryDto,
  ) {
    return this.prismaService.interview_sessions.findMany({
      where: this.where(userId, query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        configuration_id: true,
        attempt_number: true,
        status: true,
        started_at: true,
        completed_at: true,
        duration_seconds: true,
        overall_score: true,
        created_at: true,
        updated_at: true,
        interview_configurations: {
          select: {
            name: true,
            interview_type: true,
            question_count: true,
            duration_minutes: true,
            interview_positions: { select: { id: true, name: true } },
            interview_levels: { select: { id: true, name: true } },
            interview_configuration_technologies: {
              select: {
                interview_technologies: {
                  select: { id: true, name: true, slug: true },
                },
              },
            },
            interview_configuration_topics: {
              select: {
                interview_topics: { select: { id: true, name: true } },
              },
            },
          },
        },
        interview_session_questions: {
          select: {
            id: true,
            interview_answers: {
              where: { user_id: userId },
              select: { id: true },
            },
          },
        },
      },
    });
  }

  countAiInterviewHistoryByUserId(
    userId: number,
    query: CandidateInterviewHistoryQueryDto,
  ) {
    return this.prismaService.interview_sessions.count({
      where: this.where(userId, query),
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
      select: {
        id: true,
        configuration_id: true,
        attempt_number: true,
        status: true,
        started_at: true,
        created_at: true,
        interview_configurations: {
          select: {
            question_count: true,
            interview_positions: { select: { id: true, name: true } },
            interview_levels: { select: { id: true, name: true } },
          },
        },
        interview_session_questions: {
          select: {
            interview_answers: {
              where: { user_id: userId },
              select: { id: true },
            },
          },
        },
      },
    });
  }

  findAiInterviewHistoryDetailByUserId(sessionId: number, userId: number) {
    return this.prismaService.interview_sessions.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
        interview_configurations: { is: { user_id: userId } },
      },
      include: {
        interview_configurations: { include: this.configurationInclude() },
        interview_reports: true,
        interview_session_questions: {
          orderBy: { display_order: 'asc' },
          include: {
            interview_answers: {
              where: { user_id: userId },
              orderBy: { created_at: 'asc' },
              include: {
                interview_answer_reviews: {
                  orderBy: { created_at: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  findSessionByIdAndUserId(sessionId: number, userId: number) {
    return this.prismaService.interview_sessions.findFirst({
      where: { id: sessionId, user_id: userId },
    });
  }

  startSession(sessionId: number, userId: number, startedAt: Date) {
    return this.prismaService.interview_sessions.updateMany({
      where: {
        id: sessionId,
        user_id: userId,
        status: interview_sessions_status.PENDING,
      },
      data: {
        status: interview_sessions_status.IN_PROGRESS,
        started_at: startedAt,
        updated_at: new Date(),
      },
    });
  }

  completeSession(
    sessionId: number,
    userId: number,
    data: { completedAt: Date; durationSeconds: number; overallScore?: number },
  ) {
    return this.prismaService.interview_sessions.updateMany({
      where: {
        id: sessionId,
        user_id: userId,
        status: interview_sessions_status.IN_PROGRESS,
      },
      data: {
        status: interview_sessions_status.COMPLETED,
        completed_at: data.completedAt,
        duration_seconds: data.durationSeconds,
        overall_score: data.overallScore,
        updated_at: new Date(),
      },
    });
  }

  cancelSession(
    sessionId: number,
    userId: number,
    durationSeconds: number | null,
  ) {
    return this.prismaService.interview_sessions.updateMany({
      where: {
        id: sessionId,
        user_id: userId,
        status: {
          in: ACTIVE_SESSION_STATUSES,
        },
      },
      data: {
        status: interview_sessions_status.CANCELLED,
        duration_seconds: durationSeconds,
        updated_at: new Date(),
      },
    });
  }
}
