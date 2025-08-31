import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { STAFF_ROLES_KEY } from "@/modules/staff/infra/decorators/staff-roles.decorator";

@Injectable()
export class CompanyGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const companyRoles =
			this.reflector.get<StaffRole[]>(STAFF_ROLES_KEY, context.getHandler()) ||
			[];

		const companyId = request.params.companyId || request.user.companyId;
		const user = request.user;

		if (!companyId) {
			throw new ForbiddenException(
				"Company ID is required in route parameters",
			);
		}

		if (!user || !user.sub) {
			throw new ForbiddenException("User not authenticated");
		}

		// Agora a validação é apenas com base no token
		if (user.companyId !== companyId) {
			throw new ForbiddenException("User does not belong to this company");
		}

		// Se roles foram passadas, verifica se a role do token está no array
		if (
			companyRoles.length > 0 &&
			!companyRoles.includes(user.role as StaffRole)
		) {
			throw new ForbiddenException(
				"User does not have permission for this action",
			);
		}

		// Anexa role no request se precisar
		request.userCompanyRole = user.role;

		return true;
	}
}
