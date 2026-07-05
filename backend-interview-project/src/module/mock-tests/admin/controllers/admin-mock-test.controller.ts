import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiResponse,
  ApiResponseWithMeta,
} from 'src/shared/responses/api-response.interface';
import { AdminAuth } from 'src/shared/security/decorators/admin-auth.decorator';
import { CurrentUserId } from 'src/shared/security/decorators/current-user-id.decorator';
import { AttachMockTestQuestionsDto } from '../dtos/attach-mock-test-questions.dto';
import { CreateMockTestDto } from '../dtos/create-mock-test.dto';
import { MockTestQueryDto } from '../dtos/mock-test-query.dto';
import { UpdateMockTestDto } from '../dtos/update-mock-test.dto';
import { AdminMockTestService } from '../services/admin-mock-test.service';

@ApiTags('Admin Mock Tests')
@Controller('admin/mock-tests')
@AdminAuth()
export class AdminMockTestController {
  constructor(private readonly adminMockTestService: AdminMockTestService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get mock tests for admin' })
  async getMockTests(
    @Query() query: MockTestQueryDto,
  ): Promise<ApiResponseWithMeta<any[], any>> {
    const result = await this.adminMockTestService.getMockTests(query);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock tests retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create mock test' })
  async createMockTest(
    @CurrentUserId() adminUserId: number,
    @Body() dto: CreateMockTestDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.createMockTest(
      adminUserId,
      dto,
    );

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Mock test created successfully',
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get mock test detail for admin' })
  async getMockTestById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.getMockTestById(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update mock test' })
  async updateMockTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMockTestDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.updateMockTest(id, dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete mock test' })
  async deleteMockTest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.deleteMockTest(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test deleted successfully',
      data,
    };
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish mock test' })
  async publishMockTest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.publishMockTest(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test published successfully',
      data,
    };
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive mock test' })
  async archiveMockTest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.archiveMockTest(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test archived successfully',
      data,
    };
  }

  @Post(':id/questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Attach question banks to mock test' })
  async attachQuestions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AttachMockTestQuestionsDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.adminMockTestService.attachQuestions(id, dto);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mock test questions attached successfully',
      data,
    };
  }
}
