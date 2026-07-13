import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import {
  ApiResponse,
  ApiResponseWithMeta,
} from 'src/shared/responses/api-response.interface';
import { CurrentUserId } from 'src/shared/security/decorators/current-user-id.decorator';
import { JwtAccessGuard } from 'src/shared/security/guards/jwt-access.guard';
import { ApiAuth } from 'src/shared/swagger/decorators/api-auth.decorator';
import { MockTestQueryDto } from '../../admin/dtos/mock-test-query.dto';
import { SubmitMockTestAnswerDto } from '../dtos/submit-mock-test-answer.dto';
import { SubmitMockTestDto } from '../dtos/submit-mock-test.dto';
import { CandidateMockTestService } from '../services/candidate-mock-test.service';

@ApiTags('Candidate Mock Tests')
@Controller('mock-tests')
export class CandidateMockTestController {
  constructor(
    private readonly candidateMockTestService: CandidateMockTestService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get published mock tests' })
  async getMockTests(
    @Query() query: MockTestQueryDto,
  ): Promise<ApiResponseWithMeta<any[], any>> {
    const result =
      await this.candidateMockTestService.getPublishedMockTests(query);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock tests retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('my-attempts')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user mock test attempts' })
  async getMyAttempts(
    @CurrentUserId() userId: number,
  ): Promise<ApiResponse<any[]>> {
    const data = await this.candidateMockTestService.getMyAttempts(userId);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test attempts retrieved successfully',
      data,
    };
  }

  @Get('attempts/:attemptId')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user mock test attempt' })
  async getAttempt(
    @CurrentUserId() userId: number,
    @Param('attemptId', ParseIntPipe) attemptId: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.candidateMockTestService.getAttempt(
      userId,
      attemptId,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test attempt retrieved successfully',
      data,
    };
  }

  @Post('attempts/:attemptId/answers')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save current user mock test answer' })
  async saveAnswer(
    @CurrentUserId() userId: number,
    @Param('attemptId', ParseIntPipe) attemptId: number,
    @Body() dto: SubmitMockTestAnswerDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.candidateMockTestService.saveAnswer(
      userId,
      attemptId,
      dto,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test answer saved successfully',
      data,
    };
  }

  @Post(':id/submit')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit and grade a published mock test' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: SubmitMockTestDto })
  async submitMockTest(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitMockTestDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.candidateMockTestService.submitMockTest(
      userId,
      id,
      dto,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test submitted successfully',
      data,
    };
  }

  @Post('attempts/:attemptId/submit')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit current user mock test attempt' })
  async submitAttempt(
    @CurrentUserId() userId: number,
    @Param('attemptId', ParseIntPipe) attemptId: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.candidateMockTestService.submitAttempt(
      userId,
      attemptId,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test submitted successfully',
      data,
    };
  }

  @Get('attempts/:attemptId/result')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user mock test result' })
  async getResult(
    @CurrentUserId() userId: number,
    @Param('attemptId', ParseIntPipe) attemptId: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.candidateMockTestService.getResult(
      userId,
      attemptId,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test result retrieved successfully',
      data,
    };
  }

  @Post(':id/attempts/start')
  @UseGuards(JwtAccessGuard)
  @ApiAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start a mock test attempt' })
  async startAttempt(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.candidateMockTestService.startAttempt(userId, id);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Mock test attempt started successfully',
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get published mock test detail by id' })
  @ApiParam({
    name: 'id',
    description: 'Mock test id (legacy slug is supported)',
  })
  async getMockTestDetail(
    @Param('id') identifier: string,
  ): Promise<ApiResponse<any>> {
    const data =
      await this.candidateMockTestService.getPublishedMockTest(identifier);

    if (!data) {
      throw new NotFoundException('Published mock test not found');
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test retrieved successfully',
      data,
    };
  }
}
