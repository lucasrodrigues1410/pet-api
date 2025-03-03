import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../../infrastructure/strategies/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return data ? request.user[data] : request.user;
  },
);
