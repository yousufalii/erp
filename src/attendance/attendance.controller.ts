import { 
  Controller, 
  Get, 
  Post, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AttendanceProvider } from './attendance.provider';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Attendance Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly provider: AttendanceProvider) {}

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
