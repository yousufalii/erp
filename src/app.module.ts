import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { envSchema } from './config/env.config';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SettingModule } from './settings/setting.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ActivityLogModule } from './lib/activity-log/activity-log.module';
import { EmployeeModule } from './employee/employee.module';
import { LoggingInterceptor } from './lib/interceptor/logging.interceptor';
import { TenantInterceptor } from './lib/interceptor/tenant.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error(
            `❌ Config validation error: ${JSON.stringify(result.error.format(), null, 2)}`,
          );
        }
        return result.data;
      },
    }),
    DatabaseModule,
    TenantModule,
    UserModule,
    AuthModule,
    SettingModule,
    OnboardingModule,
    ActivityLogModule,
    EmployeeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
