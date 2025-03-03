import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from 'src/modules/user/domain/entities/user.entity';

interface ActiveUser {
  id: number;
  name: string;
  email: string;
  type: UserType;
}

export const CurrentUser = createParamDecorator(
  (data: keyof Partial<ActiveUser>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return (request.user as ActiveUser)[data];
    }
    return request.user;
  },
);
