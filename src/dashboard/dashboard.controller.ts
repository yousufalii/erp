import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DashboardProvider } from './dashboard.provider';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';

@ApiTags('HR Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly provider: DashboardProvider) {}

  @Get('summary')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'Internal organizational health snapshots for HR and Admin' })
  @ApiResponse({ status: 200, type: ResponseDto, description: 'Summary data fetched.' })
  async getSummary(@CurrentUser() user: User) {
    const result = await this.provider.getSummary(user.tenantId);
    return result;
  }
}
