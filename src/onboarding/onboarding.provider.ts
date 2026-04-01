import { Injectable } from '@nestjs/common';
import { TenantProvider } from '../tenant/tenant.provider';
import { UserProvider } from '../user/user.provider';
import { UserRoles } from '../lib/enums/user.enum';
import { BadRequestHandler } from '../lib/helpers/responseHandlers';
import { OnboardTenantDto } from './dto/onboard-tenant.dto';
import { AuthProvider } from '../auth/auth.provider';
import { UserStatus } from '../lib/enums/user.enum';

@Injectable()
export class OnboardingProvider {
  constructor(
    private readonly tenantProvider: TenantProvider,
    private readonly userProvider: UserProvider,
    private readonly authProvider: AuthProvider,
  ) {}

  async onboardTenant(payload: OnboardTenantDto) {
    const subdomain = payload.subdomain.toLowerCase().replace(/\s/g, '-');
    const existing = await this.tenantProvider.getTenantBySubdomain(subdomain);
    BadRequestHandler({
      condition: !!existing,
      message: 'This subdomain is already registered.',
    });

    const existingUser = await this.userProvider.findOneByEmail(payload.admin.email);
    BadRequestHandler({
      condition: !!existingUser,
      message: 'Email is already used by another user.',
    });

    const tenant = await this.tenantProvider.createTenant({
      name: payload.name,
      subdomain: subdomain,
    });

    const adminRole = await this.userProvider.createRole({
      name: UserRoles.ADMIN,
      description: 'System Administrator with full access.',
      permissions: ['ALL'],
    }, tenant.id);

    await this.userProvider.createRole({
      name: UserRoles.EMPLOYEE,
      description: 'Default staff role.',
      permissions: ['VIEW_SELF'],
    }, tenant.id);

    const hashedPassword = await this.authProvider.hashPassword(payload.admin.password);
    const admin = await this.userProvider.createUser({
      firstName: payload.admin.firstName,
      lastName: payload.admin.lastName,
      email: payload.admin.email,
      password: hashedPassword,
      role: adminRole,
      tenantId: tenant.id,
      status: UserStatus.ACTIVE,
    });

    const { password, ...adminWithoutPassword } = admin;

    return {
      message: 'Organization and Admin account established successfully!',
      data: {
        tenant,
        admin: adminWithoutPassword,
      },
    };
  }
}
