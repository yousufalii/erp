import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from '../../tenant/tenant.context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContext: TenantContext) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    const user = request.user;
    const headerTenantId = request.headers['x-tenant-id'];

    if (user) {
      this.tenantContext.tenantId = user.tenantId;
      this.tenantContext.userId = user.id;
    } else if (headerTenantId) {
      this.tenantContext.tenantId = headerTenantId as string;
    }

    return next.handle();
  }
}
