import { 
  Controller, 
  Get, 
  Post, 
  Body,
  Param,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PayrollProvider } from './payroll.provider';
import { CreateSalaryStructureDto, GeneratePayrollDto } from './dto/payroll.dto';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Payroll Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly provider: PayrollProvider) {}

  @Post('structure')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'UPSERT_SALARY_STRUCTURE', module: 'PAYROLL' })
  @ApiOperation({ summary: 'Define or update an employee salary structure' })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Structure saved.' })
  async upsertStructure(@Body() payload: CreateSalaryStructureDto, @CurrentUser() user: User) {
    return this.provider.upsertSalaryStructure(payload, user.tenantId, user.id);
  }

  @Post('generate')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'GENERATE_PAYROLL', module: 'PAYROLL' })
  @ApiOperation({ summary: 'Process monthly payroll for all organization employees' })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Batch generation started.' })
  async generate(@Body() payload: GeneratePayrollDto, @CurrentUser() user: User) {
    return this.provider.generateMonthlyPayroll(payload, user.tenantId);
  }

  @Post('finalize/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'FINALIZE_PAYROLL', module: 'PAYROLL' })
  @ApiOperation({ summary: 'Lock a payroll record after verification' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async finalize(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.finalizePayroll(id, user.tenantId);
  }

  @Get('payslip/:id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER, UserRoles.EMPLOYEE)
  @ApiOperation({ summary: 'Get detailed breakdown for PDF payslip rendering' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async getPayslip(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.getPayslip(id, user.tenantId);
  }

  @Get('my-payslips')
  @ApiOperation({ summary: 'View personal monthly payslip history' })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  async getMyPayrolls(@CurrentUser() user: User) {
    return this.provider.getMyPayrolls(user.id, user.tenantId);
  }
}
