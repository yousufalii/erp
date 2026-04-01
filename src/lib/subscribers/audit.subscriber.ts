import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BaseTenantEntity } from '../entities/base.entity';
import { TenantContext } from '../../tenant/tenant.context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseTenantEntity> {
  constructor(private readonly tenantContext: TenantContext) {}

  listenTo() {
    return BaseTenantEntity;
  }

  async beforeInsert(event: InsertEvent<BaseTenantEntity>) {
    const userId = this.tenantContext.userId;
    if (userId) {
      event.entity.createdBy = userId;
      event.entity.updatedBy = userId;
    }
  }

  async beforeUpdate(event: UpdateEvent<BaseTenantEntity>) {
    const userId = this.tenantContext.userId;
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }
}
