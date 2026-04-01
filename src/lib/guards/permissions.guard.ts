import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ForbiddenHandler } from '../helpers/responseHandlers';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userPermissions = user.role?.permissions || [];

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    ForbiddenHandler({
      condition: !hasPermission,
      message: 'You do not have the required permissions to perform this action.',
    });

    return true;
  }
}
