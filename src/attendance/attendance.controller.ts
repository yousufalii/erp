import { 
  Controller, 
  Get, 
  Post, 
  Patch,
  Param,
  Body,
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AttendanceProvider } from './attendance.provider';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { CreateAttendancePolicyDto } from './dto/attendance-policy.dto';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly provider: AttendanceProvider) {}

  @Post('policy')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'SET_ATTENDANCE_POLICY', module: 'ATTENDANCE' })
  @ApiOperation({ summary: 'Define or update organizational attendance rules (Shifts, Off-days)' })
  @ApiResponse({ status: 201, type: ResponseDto })
  async setPolicy(@Body() payload: CreateAttendancePolicyDto, @CurrentUser() user: User) {
    return this.provider.upsertPolicy(payload, user.tenantId);
  }

  @Get('policy')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER, UserRoles.EMPLOYEE)
  @ApiOperation({ summary: 'Get currently active attendance rules' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async getPolicy(@CurrentUser() user: User) {
    return this.provider.getPolicy(user.tenantId);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'OVERRIDE_ATTENDANCE', module: 'ATTENDANCE' })
  @ApiOperation({ summary: 'Manual override of an attendance record (Admin/HR only)' })
  @ApiResponse({ status: 200, type: ResponseDto, description: 'Attendance record manually corrected.' })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateAttendanceDto,
    @CurrentUser() user: User,
  ) {
    return this.provider.update(id, payload, user.tenantId);
  }

  @Post('check-in')
  @Activity({ action: 'CHECK_IN', module: 'ATTENDANCE' })
  @ApiOperation({ summary: 'Register check-in timestamp' })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Check-in recorded.' })
  @ApiResponse({ status: 400, type: ResponseDto, description: 'Double check-in or profile error.' })
  async checkIn(@CurrentUser() user: User) {
    return this.provider.checkIn(user.id, user.tenantId);
  }

  @Post('check-out')
  @Activity({ action: 'CHECK_OUT', module: 'ATTENDANCE' })
  @ApiOperation({ summary: 'Register check-out timestamp and calculate daily status' })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Check-out recorded and hours calculated.' })
  @ApiResponse({ status: 400, type: ResponseDto, description: 'No check-in record for today.' })
  async checkOut(@CurrentUser() user: User) {
    return this.provider.checkOut(user.id, user.tenantId);
  }

  @Get('my-logs')
  @ApiOperation({ summary: 'View personal attendance logs for a specific month' })
  @ApiQuery({ name: 'month', example: 4, required: true })
  @ApiQuery({ name: 'year', example: 2026, required: true })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  async getMyLogs(
    @CurrentUser() user: User,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.provider.getMyLogs(user.id, user.tenantId, Number(month), Number(year));
  }
}
