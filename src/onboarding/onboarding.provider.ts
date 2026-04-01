import { Injectable } from '@nestjs/common';
import { TenantProvider } from '../tenant/tenant.provider';
import { UserProvider } from '../user/user.provider';
import { UserRoles } from '../lib/enums/user.enum';
import { BadRequestHandler } from '../lib/helpers/responseHandlers';

@Injectable()
export class OnboardingProvider {
  constructor(
    private readonly tenantProvider: TenantProvider,
    private readonly userProvider: UserProvider,
  ) {}

  async onboardTenant(payload: { name: string; subdomain?: string }) {
    // 1. Check if subdomain exists
    const subdomain = payload.subdomain || payload.name.toLowerCase().replace(/\s/g, '-');
    const existing = await this.tenantProvider.getTenantBySubdomain(subdomain);
    BadRequestHandler({
      condition: !!existing,
      message: 'This subdomain or organization name is already taken.',
    });

    // 2. Create the Tenant
    const tenant = await this.tenantProvider.createTenant({
      name: payload.name,
      subdomain: subdomain,
    });

    // 3. Setup Initial Roles for the new Tenant
    // Create ADMIN role
    const adminRole = await this.userProvider.createRole({
      name: UserRoles.ADMIN,
      description: 'System Administrator with full access.',
      permissions: ['ALL'], // Or dynamic list
    }, tenant.id);

    // Create EMPLOYEE role
    await this.userProvider.createRole({
      name: UserRoles.EMPLOYEE,
      description: 'Default staff role.',
      permissions: ['VIEW_PROFILE'],
    }, tenant.id);

    return {
      message: 'Organization onboarded successfully!',
      data: {
        tenant,
        initialAdminRoleId: adminRole.id,
      },
    };
  }
}
