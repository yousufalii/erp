import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ForbiddenHandler } from '../helpers/responseHandlers';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    const hasRole = requiredRoles.some((role) => user.role?.name === role);
    
    ForbiddenHandler({
      condition: !hasRole,
      message: 'You do not have the necessary role to access this resource.',
    });
    
    return true;
  }
}
