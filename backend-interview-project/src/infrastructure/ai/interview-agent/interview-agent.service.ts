import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { InterviewAgentConfig } from 'src/config/env.interface';
import {
  EvaluateAnswerInput,
  InterviewAgentEvaluationResult,
} from './interview-agent.types';

@Injectable()
export class InterviewAgentService {
  private readonly logger = new Logger(InterviewAgentService.name);
  private readonly serviceUrl: string;
  private readonly internalServiceToken?: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    const agentConfig = this.configService.getOrThrow<InterviewAgentConfig>(
      'config.interviewAgent',
    );

    this.serviceUrl = agentConfig.serviceUrl.replace(/\/$/, '');
    this.internalServiceToken = agentConfig.internalServiceToken;
    this.timeoutMs = agentConfig.timeoutMs;
  }

  /**
   * Gọi interview-agent-service để đánh giá câu trả lời đã có đầy đủ context.
   */
  async evaluateAnswer(
    input: EvaluateAnswerInput,
  ): Promise<InterviewAgentEvaluationResult> {
    const targetUrl = `${this.serviceUrl}/evaluate-answer`;

    try {
      const response = await axios.post<InterviewAgentEvaluationResult>(
        targetUrl,
        input,
        {
          headers: this.buildHeaders(),
          timeout: this.timeoutMs,
        },
      );

      return response.data;
    } catch (error) {
      this.logEvaluationError(error, targetUrl, input);

      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new GatewayTimeoutException('Interview AI provider timeout');
      }

      throw new BadGatewayException(
        'Interview AI service failed to evaluate answer',
      );
    }
  }

  private logEvaluationError(
    error: unknown,
    targetUrl: string,
    input: EvaluateAnswerInput,
  ): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Interview agent error: url=${targetUrl}, status=${axiosError.response?.status ?? 'NO_RESPONSE'}, code=${axiosError.code ?? 'UNKNOWN'}, responseData=${this.stringifySafeResponse(axiosError.response?.data)}, sessionId=${input.sessionId}, turnId=${input.turnId}`,
      );

      return;
    }

    this.logger.error(
      `Interview agent error: url=${targetUrl}, errorType=${error instanceof Error ? error.name : typeof error}, sessionId=${input.sessionId}, turnId=${input.turnId}`,
    );
  }

  private stringifySafeResponse(data: unknown): string {
    if (data === undefined) {
      return 'undefined';
    }

    try {
      return JSON.stringify(data);
    } catch {
      return '[unserializable]';
    }
  }

  private buildHeaders(): Record<string, string> {
    if (!this.internalServiceToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${this.internalServiceToken}`,
    };
  }
}
