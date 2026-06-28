import { Prisma } from 'generated/prisma/client';

export type AdminInterviewQuestionBankRecord =
  Prisma.interview_question_banksGetPayload<{
    include: {
      interview_topics: true;
      interview_technologies: true;
      interview_question_bank_options: true;
    };
  }>;

export type AdminInterviewQuestionBankRecordWithUsage =
  Prisma.interview_question_banksGetPayload<{
    include: {
      interview_topics: true;
      interview_technologies: true;
      interview_question_bank_options: true;
      _count: {
        select: {
          interview_session_questions: true;
        };
      };
    };
  }>;

export interface AdminInterviewQuestionBankQueryResult {
  questionBank: AdminInterviewQuestionBankRecord;
}
