import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { USER_TYPE_KEY } from "../decorators/user-type.decorator";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride("isPublic", [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;

		// Executa o AuthGuard padrão para validação do token
		const can = await super.canActivate(context);

		if (!can) return false;

		// Recupera o userType definido via decorator
		const requiredUserType = this.reflector.getAllAndOverride<string>(
			USER_TYPE_KEY,
			[context.getHandler(), context.getClass()],
		) as unknown as string[];

		// Caso haja um userType definido, verifica se o usuário possui o mesmo
		if (requiredUserType) {
			const request = context.switchToHttp().getRequest();
			const user = request.user;

			// Se o userType do usuário não for o esperado, lança exceção
			if (!requiredUserType.includes(user.type)) {
				throw new UnauthorizedException("Tipo de usuário não autorizado");
			}
		}
		return true;
	}
}
