import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../../infrastructure/strategies/jwt.strategy';

export const User = createParamDecorator(
  (data: keyof UserPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return data ? request.user[data] : request.user;
  },
);
