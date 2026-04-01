import { Controller, Post, Get, Body } from '@nestjs/common';
import { TenantProvider } from './tenant.provider';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BadRequestHandler } from '../lib/helpers/responseHandlers';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Tenant Onboarding')
@Controller('onboarding')
export class TenantController {
  constructor(private readonly tenantProvider: TenantProvider) {}

  @Post('tenant')
  @Activity({ action: 'ONBOARD_TENANT', module: 'ONBOARDING' })
  @ApiOperation({ summary: 'Register a new organization/company' })
  async onboard(@Body() payload: { name: string; subdomain?: string }) {
    const existing = await this.tenantProvider.getTenantBySubdomain(payload.subdomain || payload.name);
    BadRequestHandler({
      condition: !!existing,
      message: 'This organization or subdomain is already registered.',
    });

    return this.tenantProvider.createTenant(payload);
  }

  @Get('tenants')
  @ApiOperation({ summary: 'List all companies (For Admin purposes)' })
  async list() {
    return this.tenantProvider.getAllTenants();
  }
}
