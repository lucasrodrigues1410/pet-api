import type { DateRange } from "@/shared/types/date-range";
import { Staff } from "../entities/staff.entity";

export abstract class StaffRepository {
	abstract findById(id: string): Promise<Staff | null>;
	abstract findByUserId(userId: string): Promise<Staff | null>;
	abstract findByCompanyId(companyId: string): Promise<Staff[]>;
	abstract fetchCompanyStaffWithAppointmentsInDateRange(
		companyId: string,
		range: DateRange,
	): Promise<Staff[]>;
	abstract findAvailableForSlot(
		companyId: string,
		range: DateRange,
	): Promise<Staff[]>;
	abstract create(staff: Staff): Promise<void>;
}
