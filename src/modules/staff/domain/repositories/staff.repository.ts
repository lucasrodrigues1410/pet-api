import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { User } from "@/modules/user/domain/entities/user.entity";
import type { DateRange } from "@/shared/types/date-range";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Staff, StaffRole } from "../entities/staff.entity";

export abstract class StaffRepository {
	abstract findByUserEmail(userEmail: string): Promise<Staff | null>;
	abstract findById(id: string): Promise<Staff | null>;
	abstract findByUserId(userId: string): Promise<Staff | null>;
	abstract findByCompanyId(
		companyId: string,
		query: PaginationQuery & { query?: string; roles?: StaffRole[] },
	): Promise<PaginationResult<Staff & { user: User }>>;
	abstract fetchCompanyStaffWithAppointmentsInDateRange(
		companyId: string,
		range: DateRange,
	): Promise<Staff[]>;
	abstract findAvailableForSlot(
		companyId: string,
		range: DateRange,
	): Promise<UniqueEntityID | null>;
	abstract create(staff: Staff): Promise<void>;
	abstract delete(id: string): Promise<void>;
	abstract totalStaffByCompanyId(companyId: string): Promise<number>;
}
