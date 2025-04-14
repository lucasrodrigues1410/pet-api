import { Staff } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { DateRange } from "@/shared/types/date-range";

export class InMemoryStaffRepository implements StaffRepository {
	public items: Staff[] = [];

	async findById(id: string) {
		const staff = this.items.find((staff) => staff.id.toString() === id);
		return staff || null;
	}

	async findByUserId(userId: string) {
		const staff = this.items.find(
			(staff) => staff.userId.toString() === userId,
		);
		return staff || null;
	}

	async findByCompanyId(companyId: string) {
		const staff = this.items.filter(
			(staff) => staff.companyId.toString() === companyId,
		);
		return staff;
	}

	async fetchCompanyStaffWithAppointmentsInDateRange(
		companyId: string,
		range: DateRange,
	) {
		const staff = this.items.filter(
			(staff) => staff.companyId.toString() === companyId,
		);
		return staff;
	}

	async findAvailableForSlot(
		companyId: string,
		range: DateRange,
	): Promise<Staff[]> {
		const staff = this.items.filter(
			(staff) => staff.companyId.toString() === companyId,
		);
		return staff;
	}

	async create(staff: Staff) {
		this.items.push(staff);
	}
}
