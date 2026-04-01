import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PerformanceProvider } from './performance.provider';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Performance Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly provider: PerformanceProvider) {}

  @Post('initiate')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'INITIATE_APPRAISAL', module: 'PERFORMANCE' })
  @ApiOperation({ summary: 'Open a new performance review cycle for an employee' })
  @ApiResponse({ status: 201, type: ResponseDto })
  async initiate(@Body() payload: { employeeId: string, year: number, cycle: number }, @CurrentUser() user: User) {
    return this.provider.initiateAppraisal(payload.employeeId, payload.year, payload.cycle, user.tenantId);
  }

  @Post('self-assess/:id')
  @Activity({ action: 'SUBMIT_SELF_ASSESSMENT', module: 'PERFORMANCE' })
  @ApiOperation({ summary: 'Employees submit their own performance ratings and comments' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async selfAssess(@Param('id') id: string, @Body() payload: { rating: number, feedback: string }, @CurrentUser() user: User) {
    return this.provider.submitSelfAssessment(id, payload.rating, payload.feedback, user.id, user.tenantId);
  }

  @Post('manager-review/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'SUBMIT_MANAGER_REVIEW', module: 'PERFORMANCE' })
  @ApiOperation({ summary: 'Managers/HR finalize the appraisal with their own assessment' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async managerReview(@Param('id') id: string, @Body() payload: { rating: number, feedback: string }, @CurrentUser() user: User) {
    return this.provider.managerReview(id, payload.rating, payload.feedback, user.tenantId);
  }

  @Get('my-summary')
  @ApiOperation({ summary: 'View personal OKRs and KPI progress targets' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async getMyMetrics(@CurrentUser() user: User, @Query('year') year: number) {
    return this.provider.getMyPerformanceSummary(user.id, user.tenantId, year || new Date().getFullYear());
  }
}
