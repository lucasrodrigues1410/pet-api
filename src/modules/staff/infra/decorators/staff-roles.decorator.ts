import { SetMetadata } from "@nestjs/common";
import type { StaffRole } from "@/modules/staff/domain/entities/staff.entity";

export const STAFF_ROLES_KEY = "staff_roles";
export const StaffRoles = (...roles: StaffRole[]) =>
	SetMetadata(STAFF_ROLES_KEY, roles);
