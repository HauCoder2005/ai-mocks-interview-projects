import {
  Controller,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiResponse,
  ApiResponseWithMeta,
} from 'src/shared/responses/api-response.interface';
import { CurrentUserId } from 'src/shared/security/decorators/current-user-id.decorator';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import { CandidateInterviewHistoryQueryDto } from '../dtos/candidate-interview-history-query.dto';
import { CompleteCandidateInterviewSessionDto } from '../dtos/complete-candidate-interview-session.dto';
import { CandidateInterviewHistoryMapper } from '../mappers/candidate-interview-history.mapper';
import { CandidateInterviewHistoryService } from '../services/candidate-interview-history.service';

@ApiTags('Candidate Interview History')
@Controller('interviews')
@UseGuards(JwtAccessGuard)
@ApiAuth()
export class CandidateInterviewHistoryController {
  constructor(private readonly service: CandidateInterviewHistoryService) {}

  @Get('sessions/active')
  @ApiOperation({ summary: 'Get current user active AI interview session' })
  async getActiveSession(
    @CurrentUserId() userId: number,
  ): Promise<ApiResponse<any | null>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active interview session retrieved successfully',
      data: await this.service.getActiveSession(userId),
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get current user interview history' })
  async getHistory(
    @CurrentUserId() userId: number,
    @Query() query: CandidateInterviewHistoryQueryDto,
  ): Promise<ApiResponseWithMeta<any[], any>> {
    const result = await this.service.getHistory(userId, query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview history retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('history/:sessionId')
  @ApiOperation({ summary: 'Get current user interview history detail' })
  @ApiParam({ name: 'sessionId', type: Number })
  async getDetail(
    @CurrentUserId() userId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ): Promise<ApiResponse<any>> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview history detail retrieved successfully',
      data: await this.service.getDetail(userId, sessionId),
    };
  }

  @Patch('sessions/:sessionId/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start pending interview session' })
  async start(
    @CurrentUserId() userId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ): Promise<ApiResponse<any>> {
    const record = await this.service.start(userId, sessionId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview session started successfully',
      data: CandidateInterviewHistoryMapper.toLifecycleResponse(record),
    };
  }

  @Patch('sessions/:sessionId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete in-progress interview session' })
  async complete(
    @CurrentUserId() userId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() dto: CompleteCandidateInterviewSessionDto,
  ): Promise<ApiResponse<any>> {
    const record = await this.service.complete(
      userId,
      sessionId,
      dto.overallScore,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview session completed successfully',
      data: CandidateInterviewHistoryMapper.toLifecycleResponse(record),
    };
  }

  @Patch('sessions/:sessionId/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel interview session without deleting it' })
  async cancel(
    @CurrentUserId() userId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ): Promise<ApiResponse<any>> {
    const record = await this.service.cancel(userId, sessionId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Interview session cancelled successfully',
      data: CandidateInterviewHistoryMapper.toLifecycleResponse(record),
    };
  }
}
