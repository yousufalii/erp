import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserProvider } from '../user/user.provider';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { RolesGuard } from '../lib/guards/roles.guard';
import { PermissionsGuard } from '../lib/guards/permissions.guard';
import { Roles } from '../lib/decorators/roles.decorator';
import { UserRoles } from '../lib/enums/user.enum';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { SuccessResponseDto, ErrorResponseDto } from '../lib/dto/response.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Settings - Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('settings/roles')
export class RoleController {
  constructor(private readonly userProvider: UserProvider) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new dynamic role for the current tenant' })
  @ApiResponse({ status: 201, type: SuccessResponseDto, description: 'Role successfully created.' })
  @ApiResponse({ status: 400, type: ErrorResponseDto, description: 'Identity conflict or bad request.' })
  async createRole(@Body() payload: CreateRoleDto, @CurrentUser() user: User) {
    return this.userProvider.createRole(payload, user.tenantId);
  }

  @Get()
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'List all dynamic roles in organization' })
  @ApiResponse({ status: 200, isArray: true, description: 'List of roles.' })
  async findAll(@CurrentUser() user: User) {
    return this.userProvider.findAllRoles(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.HR_MANAGER)
  @ApiOperation({ summary: 'Get role details by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userProvider.findRoleById(id, user.tenantId);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Update role permissions or details' })
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<CreateRoleDto>,
    @CurrentUser() user: User,
  ) {
    return this.userProvider.updateRole(id, payload, user.tenantId);
  }
}
