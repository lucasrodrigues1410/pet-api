import { createParamDecorator, ExecutionContext } from "@nestjs/common";

type UserData = { sub: string };

export const User = createParamDecorator(
	(data: keyof UserData, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		const user = request.user || {};
		return data ? user[data] : user;
	},
);
