import { 
  Controller, 
  Get, 
  Res, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportProvider } from './export.provider';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Data Exports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exports')
export class ExportController {
  constructor(private readonly provider: ExportProvider) {}

  @Get('employees')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'Export full active employee directory in CSV' })
  @ApiResponse({ status: 200, description: 'File download initiated.' })
  async exportEmployees(@Res() res: Response, @CurrentUser() user: User) {
    const csv = await this.provider.exportEmployees(user.tenantId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees_report.csv');
    return res.status(200).send(csv);
  }

  @Get('payroll')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'Export monthly payroll summary' })
  @ApiResponse({ status: 200, description: 'File download initiated.' })
  async exportPayroll(
    @Res() res: Response, 
    @Query('month') month: number, 
    @Query('year') year: number, 
    @CurrentUser() user: User
  ) {
    const csv = await this.provider.exportPayroll(month, year, user.tenantId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payroll_report_${month}_${year}.csv`);
    return res.status(200).send(csv);
  }
}
