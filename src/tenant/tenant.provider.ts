import { Injectable } from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantProvider {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.tenantRepository.create(data);
    return tenant;
  }

  async getTenantById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findById(id);
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.tenantRepository.findBySubdomain(subdomain);
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.findAll();
  }
}
