import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '../enum/role.enum';

export const RoleGuard = (roles: ROLE[]): Type<CanActivate> => {
  class RoleGuardMixin extends AuthGuard() {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};
