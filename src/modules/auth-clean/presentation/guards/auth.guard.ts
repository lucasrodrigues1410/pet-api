import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const token = this.extractToken(request);
		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload = this.jwtService.verifyAsync(token,{
                secret: 'secret',
            });
            request.user = payload;
		} catch (error) {
            throw new UnauthorizedException();
        }

		return request.isAuthenticated();
	}

	private extractToken(request: Request): string | undefined {
		const [type, token] = (request.headers?.authorization ?? "").split(" ");
		return type === "Bearer" ? token : undefined;
	}
}
