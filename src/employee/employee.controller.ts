import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { EmployeeProvider } from './employee.provider';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { SuccessResponseDto, ErrorResponseDto } from '../lib/dto/response.dto';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Employee Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly provider: EmployeeProvider) {}

  @Post()
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'CREATE_EMPLOYEE', module: 'HRM' })
  @ApiOperation({ summary: 'Register a new employee' })
  @ApiResponse({ status: 201, type: SuccessResponseDto, description: 'Employee successfully created.' })
  @ApiResponse({ status: 400, type: ErrorResponseDto, description: 'Duplicate code or bad request.' })
  async create(@Body() payload: CreateEmployeeDto, @CurrentUser() user: User) {
    return this.provider.create(payload, user.tenantId);
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'List all employees in the organization' })
  @ApiResponse({ status: 200, type: SuccessResponseDto, isArray: true })
  async findAll(@CurrentUser() user: User) {
    return this.provider.findAll(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'Get employee details by ID' })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @Activity({ action: 'UPDATE_EMPLOYEE', module: 'HRM' })
  @ApiOperation({ summary: 'Update employee profile sections' })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<CreateEmployeeDto>,
    @CurrentUser() user: User,
  ) {
    return this.provider.update(id, payload, user.tenantId);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  @Activity({ action: 'DELETE_EMPLOYEE', module: 'HRM' })
  @ApiOperation({ summary: 'Soft delete an employee profile' })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.provider.delete(id, user.tenantId);
  }
}
