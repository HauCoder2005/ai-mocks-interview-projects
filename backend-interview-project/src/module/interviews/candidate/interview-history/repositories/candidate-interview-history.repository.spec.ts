jest.mock(
  'generated/prisma/client',
  () => ({
    PrismaClient: class {},
    interview_sessions_status: {
      PENDING: 'PENDING',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
    },
  }),
  { virtual: true },
);

import type { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { CandidateInterviewHistoryRepository } from './candidate-interview-history.repository';

describe('CandidateInterviewHistoryRepository', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const prisma = {
    interview_sessions: { findMany, count },
  } as unknown as PrismaService;
  const repository = new CandidateInterviewHistoryRepository(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('queries only owned AI interview sessions, newest first', async () => {
    findMany.mockResolvedValue([]);

    await repository.findAiInterviewHistoryByUserId(42, {
      page: 1,
      limit: 10,
      status: 'IN_PROGRESS' as never,
    });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user_id: 42,
          status: 'IN_PROGRESS',
          interview_configurations: {
            is: expect.objectContaining({ user_id: 42 }),
          },
        }),
        orderBy: { created_at: 'desc' },
      }),
    );
  });

  it('does not restrict status when the filter is omitted', async () => {
    count.mockResolvedValue(0);

    await repository.countAiInterviewHistoryByUserId(42, {
      page: 1,
      limit: 10,
    });

    expect(count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        user_id: 42,
        status: undefined,
        interview_configurations: {
          is: expect.objectContaining({ user_id: 42 }),
        },
      }),
    });
  });
});
