import { 
  Controller, 
  Post, 
  Body,
  Param,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LifecycleProvider } from './lifecycle.provider';
import { ResignEmployeeDto, TerminateEmployeeDto } from './dto/lifecycle.dto';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Employee Lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('lifecycle')
export class LifecycleController {
  constructor(private readonly provider: LifecycleProvider) {}

  @Post('resign')
  @Activity({ action: 'RESIGN_EMPLOYEE', module: 'HRM' })
  @ApiOperation({ summary: 'Submit a formal resignation (Employee self-service)' })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Resignation record initiated.' })
  async resign(@Body() payload: ResignEmployeeDto, @CurrentUser() user: User) {
    return this.provider.resign(user.id, user.tenantId, payload);
  }

  @Post('terminate/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'TERMINATE_EMPLOYEE', module: 'HRM' })
  @ApiOperation({ summary: 'Terminate an employee with cause' })
  @ApiResponse({ status: 200, type: ResponseDto, description: 'Employee terminated and login disabled.' })
  async terminate(@Param('id') id: string, @Body() payload: TerminateEmployeeDto, @CurrentUser() user: User) {
    return this.provider.terminate(id, user.tenantId, payload);
  }

  @Post('probation-confirm/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'CONFIRM_PROBATION', module: 'HRM' })
  @ApiOperation({ summary: 'Convert employee from probation to active' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async confirm(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.confirmProbation(id, user.tenantId);
  }

  @Post('finalize-exit/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'FINALIZE_EXIT', module: 'HRM' })
  @ApiOperation({ summary: 'Complete offboarding and mark as fully exited' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async finalize(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.finalizeExit(id, user.tenantId);
  }

  @Post('exit-interview/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'RECORD_EXIT_INTERVIEW', module: 'HRM' })
  @ApiOperation({ summary: 'Record feedback and date for the exit interview' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async recordExit(
    @Param('id') id: string, 
    @Body() payload: { date: string, feedback: string }, 
    @CurrentUser() user: User
  ) {
    return this.provider.recordExitInterview(id, user.tenantId, payload);
  }
}
