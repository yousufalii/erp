import { Module } from '@nestjs/common';
import { OnboardingProvider } from './onboarding.provider';
import { OnboardingController } from './onboarding.controller';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TenantModule, UserModule],
  providers: [OnboardingProvider],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
