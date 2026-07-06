import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InterviewAgentService } from 'src/infrastructure/ai/interview-agent';
import { CandidateInterviewSessionRepository } from '../repositories/candidate-interview-session.repository';
import { CandidateInterviewEvaluationResult } from '../results/interview-evaluation/candidate-interview-evaluation-result';

interface CandidateEvaluateAnswerInput {
  userId: number;
  sessionId: number;
  turnId?: string;
  question: string;
  rawTranscript?: string;
  normalizedTranscript?: string;
  previousQuestions?: string[];
  previousAnswers?: string[];
  mainTopic?: string;
  positionName?: string;
  levelName?: string;
  interviewType?: string;
}

interface ResolvedTranscript {
  rawTranscript: string;
  normalizedTranscript: string;
}

interface PreviousTurns {
  previousQuestions: string[];
  previousAnswers: string[];
  answeredQuestionCount: number;
}

interface CurrentTurn {
  turnId: string;
  question: string;
}

interface InterviewSessionForEvaluation {
  id: number;
  configuration_id: number;
  user_id: number;
  status: string;
  interview_configurations?: {
    name?: string | null;
    interview_type?: string | null;
    question_count?: number | null;
    interview_positions?: {
      name?: string | null;
    } | null;
    interview_levels?: {
      name?: string | null;
    } | null;
    interview_configuration_topics?: Array<{
      interview_topics?: {
        name?: string | null;
      } | null;
    }>;
  } | null;
  interview_session_questions?: Array<{
    content?: string | null;
    display_order?: number | null;
    interview_answers?: Array<{
      answer_text?: string | null;
    }>;
  }>;
}

interface ResolvedInterviewContext {
  mainTopic: string;
  positionName: string;
  levelName: string;
  interviewType: string;
  previousQuestions: string[];
  previousAnswers: string[];
  currentQuestionIndex: number | null;
  totalQuestions: number | null;
  answeredQuestionCount: number | null;
  remainingQuestionCount: number | null;
}

@Injectable()
export class CandidateInterviewEvaluationService {
  constructor(
    private readonly sessionRepository: CandidateInterviewSessionRepository,
    private readonly interviewAgentService: InterviewAgentService,
  ) {}

  /**
   * Gom context theo đúng session và gọi AI agent đánh giá câu trả lời.
   */
  async evaluateAnswer(
    input: CandidateEvaluateAnswerInput,
  ): Promise<CandidateInterviewEvaluationResult> {
    const sessionId = this.validateSessionId(input.sessionId);
    const session = await this.resolveInterviewSession({
      userId: input.userId,
      sessionId,
    });
    const transcript = await this.resolveTranscriptSource(input);
    const currentTurn = this.resolveCurrentTurn(input, sessionId);
    const context = await this.resolveInterviewContext(session, input);

    const evaluation = await this.interviewAgentService.evaluateAnswer({
      sessionId: String(sessionId),
      turnId: currentTurn.turnId,
      question: currentTurn.question,
      mainTopic: context.mainTopic,
      positionName: context.positionName,
      levelName: context.levelName,
      interviewType: context.interviewType,
      rawTranscript: transcript.rawTranscript,
      normalizedTranscript: transcript.normalizedTranscript,
      previousQuestions: context.previousQuestions,
      previousAnswers: context.previousAnswers,
      sessionContext: {
        currentQuestionIndex: context.currentQuestionIndex,
        totalQuestions: context.totalQuestions,
        answeredQuestionCount: context.answeredQuestionCount,
        remainingQuestionCount: context.remainingQuestionCount,
      },
      evaluationLanguage: 'vi',
    });

    return {
      sessionId: String(sessionId),
      turnId: currentTurn.turnId,
      ...evaluation,
    };
  }

  private validateSessionId(sessionId: number): number {
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      throw new BadRequestException('Invalid interview session id');
    }

    return sessionId;
  }

  private async resolveInterviewSession(input: {
    sessionId: number;
    userId: number;
  }): Promise<InterviewSessionForEvaluation> {
    const session = await this.sessionRepository.findEvaluationContext(input);

    if (!session) {
      throw new NotFoundException(
        'Interview session not found or not in progress',
      );
    }

    return session as InterviewSessionForEvaluation;
  }

  private async resolveTranscriptSource(
    input: CandidateEvaluateAnswerInput,
  ): Promise<ResolvedTranscript> {
    const rawTranscript = input.rawTranscript?.trim() ?? '';
    const normalizedTranscript = input.normalizedTranscript?.trim() ?? '';

    if (!rawTranscript && !normalizedTranscript) {
      throw new BadRequestException(
        'rawTranscript or normalizedTranscript is required',
      );
    }

    return {
      rawTranscript: rawTranscript || normalizedTranscript,
      normalizedTranscript: normalizedTranscript || rawTranscript,
    };
  }

  private async resolveInterviewContext(
    session: InterviewSessionForEvaluation,
    input: CandidateEvaluateAnswerInput,
  ): Promise<ResolvedInterviewContext> {
    const configuration = session.interview_configurations;
    const configuredTopics =
      configuration?.interview_configuration_topics
        ?.map((item) => item.interview_topics?.name)
        .filter((topic): topic is string => Boolean(topic)) ?? [];
    const previousTurns = this.resolvePreviousTurns(session, input);
    const totalQuestions = configuration?.question_count ?? null;
    const currentQuestionIndex = previousTurns.answeredQuestionCount + 1;

    return {
      mainTopic:
        input.mainTopic?.trim() ||
        configuredTopics[0] ||
        configuration?.name ||
        configuration?.interview_positions?.name ||
        'Interview',
      positionName:
        input.positionName?.trim() ||
        configuration?.interview_positions?.name ||
        '',
      levelName:
        input.levelName?.trim() || configuration?.interview_levels?.name || '',
      interviewType:
        input.interviewType?.trim() || configuration?.interview_type || '',
      previousQuestions: previousTurns.previousQuestions,
      previousAnswers: previousTurns.previousAnswers,
      currentQuestionIndex,
      totalQuestions,
      answeredQuestionCount: previousTurns.answeredQuestionCount,
      remainingQuestionCount:
        totalQuestions === null
          ? null
          : Math.max(totalQuestions - currentQuestionIndex, 0),
    };
  }

  private resolvePreviousTurns(
    session: InterviewSessionForEvaluation,
    input: CandidateEvaluateAnswerInput,
  ): PreviousTurns {
    const sessionQuestions = session.interview_session_questions ?? [];
    const dbPreviousQuestions = sessionQuestions
      .map((item) => item.content)
      .filter((question): question is string => Boolean(question));
    const dbPreviousAnswers = sessionQuestions
      .flatMap((item) => item.interview_answers ?? [])
      .map((answer) => answer.answer_text)
      .filter((answer): answer is string => Boolean(answer));

    const fallbackPreviousQuestions = input.previousQuestions ?? [];
    const fallbackPreviousAnswers = input.previousAnswers ?? [];
    const previousQuestions = dbPreviousQuestions.length
      ? dbPreviousQuestions
      : fallbackPreviousQuestions;
    const previousAnswers = dbPreviousAnswers.length
      ? dbPreviousAnswers
      : fallbackPreviousAnswers;

    return {
      previousQuestions,
      previousAnswers,
      answeredQuestionCount: previousAnswers.length,
    };
  }

  private resolveCurrentTurn(
    input: CandidateEvaluateAnswerInput,
    sessionId: number,
  ): CurrentTurn {
    const question = input.question.trim();

    if (!question) {
      throw new BadRequestException('question is required');
    }

    return {
      turnId: input.turnId?.trim() || `session-${sessionId}-turn-current`,
      question,
    };
  }
}
