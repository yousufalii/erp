import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantContext } from './tenant.context';
import { TenantProvider } from './tenant.provider';
import { TenantRepository } from './tenant.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [],
  providers: [TenantContext, TenantProvider, TenantRepository],
  exports: [TypeOrmModule, TenantContext, TenantProvider],
})
export class TenantModule {}
