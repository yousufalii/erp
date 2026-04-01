import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly repo: Repository<Tenant>,
  ) {}

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.repo.create(data);
    return this.repo.save(tenant);
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.repo.findOne({ where: { subdomain } });
  }

  async findAll(): Promise<Tenant[]> {
    return this.repo.find();
  }
}
