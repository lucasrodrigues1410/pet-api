import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { VerifyTokenUseCase } from "../../application/use-cases/verify-token.use-case";
import { USER_TYPE_KEY } from "../decorators/user-type.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly verifyTokenUseCase: VerifyTokenUseCase,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;
        
        if (!authorizationHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedException("Cabeçalho de autorização inválido ou ausente.");
        }

        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            throw new UnauthorizedException("Token não informado.");
        }

        try {
            request.user = await this.verifyTokenUseCase.execute(token);
        } catch {
            throw new UnauthorizedException("Token inválido ou expirado.");
        }

        const requiredUserTypes = this.reflector.getAllAndOverride<string[]>(
            USER_TYPE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (requiredUserTypes?.length) {
            const userType = request.user?.type;
            if (!userType || !requiredUserTypes.includes(userType)) {
                throw new UnauthorizedException(
                    "Usuário não possui permissão para acessar essa rota.",
                );
            }
        }

        return true;
    }
}