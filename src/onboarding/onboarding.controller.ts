import { Controller, Post, Body } from '@nestjs/common';
import { OnboardingProvider } from './onboarding.provider';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Activity } from '../lib/decorators/activity.decorator';

@ApiTags('Organization Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingProvider: OnboardingProvider) {}

  @Post('tenant')
  @Activity({ action: 'ONBOARD_TENANT', module: 'ONBOARDING' })
  @ApiOperation({ summary: 'Register a new organization and initialize its base roles' })
  async onboard(@Body() payload: { name: string; subdomain?: string }) {
    return this.onboardingProvider.onboardTenant(payload);
  }
}
