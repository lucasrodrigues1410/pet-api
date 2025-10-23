import { clerkClient, getAuth } from "@clerk/fastify";
import {
	CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const isPublic = this.reflector.getAllAndOverride("isPublic", [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;

		const { isAuthenticated, userId } = await getAuth(request);
		if (!isAuthenticated) {
			throw new UnauthorizedException("Unauthorized");
		}

		const user = await clerkClient.users.getUser(userId);
		const publicMetadata = user.publicMetadata as { appUserId?: string | null };

		if (!publicMetadata?.appUserId) {
			throw new UnauthorizedException("Unauthorized");
		}

		request.user = { sub: publicMetadata.appUserId };
		return true;
	}
}
