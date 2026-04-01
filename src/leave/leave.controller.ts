import { 
  Controller, 
  Get, 
  Post, 
  Body,
  Param,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LeaveProvider } from './leave.provider';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Leave Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly provider: LeaveProvider) {}

  @Post('apply')
  @Activity({ action: 'APPLY_LEAVE', module: 'HRM' })
  @ApiOperation({ summary: 'Submit a new leave application' })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Request submitted for approval.' })
  async apply(@Body() payload: CreateLeaveRequestDto, @CurrentUser() user: User) {
    return this.provider.applyLeave(user.id, user.tenantId, payload);
  }

  @Get('my-requests')
  @ApiOperation({ summary: 'View personal leave application history' })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  async getMyRequests(@CurrentUser() user: User) {
    return this.provider.getMyRequests(user.id, user.tenantId);
  }

  @Post('cancel/:id')
  @Activity({ action: 'CANCEL_LEAVE', module: 'HRM' })
  @ApiOperation({ summary: 'Employee cancels a pending leave request' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.cancelLeave(id, user.id, user.tenantId);
  }

  @Get('pending')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER, UserRoles.EMPLOYEE) // User can be a Manager
  @ApiOperation({ summary: 'View pending requests from direct reports' })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  async getPendingTasks(@CurrentUser() user: User) {
    return this.provider.getPendingRequestsForManager(user.id, user.tenantId);
  }

  @Post('approve/:id')
  @Activity({ action: 'APPROVE_LEAVE', module: 'HRM' })
  @ApiOperation({ summary: 'Approve a pending leave request' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async approve(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.approveLeave(id, user.id, user.tenantId);
  }

  @Post('reject/:id')
  @Activity({ action: 'REJECT_LEAVE', module: 'HRM' })
  @ApiOperation({ summary: 'Reject a pending leave request with reason' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async reject(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser() user: User) {
    return this.provider.rejectLeave(id, reason, user.id, user.tenantId);
  }
}
