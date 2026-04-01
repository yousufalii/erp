import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private _tenantId: string | null = null;
  private _userId: string | null = null;

  set tenantId(id: string) {
    this._tenantId = id;
  }

  get tenantId(): string {
    return this._tenantId!;
  }

  set userId(id: string) {
    this._userId = id;
  }

  get userId(): string {
    return this._userId!;
  }
}
