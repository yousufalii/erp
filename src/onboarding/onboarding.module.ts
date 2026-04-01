import { Module } from '@nestjs/common';
import { OnboardingProvider } from './onboarding.provider';
import { OnboardingController } from './onboarding.controller';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TenantModule, UserModule, AuthModule],
  providers: [OnboardingProvider],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
