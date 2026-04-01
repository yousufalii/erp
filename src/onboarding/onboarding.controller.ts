import { Controller, Post, Body } from '@nestjs/common';
import { OnboardingProvider } from './onboarding.provider';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Activity } from '../lib/decorators/activity.decorator';
import { OnboardTenantDto } from './dto/onboard-tenant.dto';
import { ResponseDto } from '../lib/dto/response.dto';

@ApiTags('Organization Onboarding') // No emojis
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingProvider: OnboardingProvider) {}

  @Post('tenant')
  @Activity({ action: 'ONBOARD_TENANT', module: 'ONBOARDING' })
  @ApiOperation({ 
    summary: 'Initialize a new ERP instance for a company',
    description: 'Creates a Tenant registry, seeds default roles, and initializes the first High-Level Admin user.'
  })
  @ApiResponse({ status: 201, type: ResponseDto, description: 'Organization successfully created.' })
  @ApiResponse({ status: 400, type: ResponseDto, description: 'Subdomain or Admin exist error.' })
  async onboard(@Body() payload: OnboardTenantDto) {
    return this.onboardingProvider.onboardTenant(payload);
  }
}
