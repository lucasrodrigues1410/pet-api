import { Staff, StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";

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

	async findByCompanyId(
		companyId: string,
		query: PaginationQuery & {
			query?: string;
			roles?: StaffRole[];
		},
	) {
		const result = await paginate(
			async ({ skip, take }) => {
				const staff = this.items.filter(
					(staff) => staff.companyId.toString() === companyId,
				);
				return staff.slice(skip, skip + take);
			},
			async () => {
				return this.items.filter(
					(staff) => staff.companyId.toString() === companyId,
				).length;
			},
			query,
		);
		return result as PaginationResult<Staff & { user: User }>;
	}

	async fetchCompanyStaffWithAppointmentsInDateRange(companyId: string, _) {
		const staff = this.items.filter(
			(staff) => staff.companyId.toString() === companyId,
		);
		return staff;
	}

	async findAvailableForSlot(companyId: string, _): Promise<Staff[]> {
		const staff = this.items.filter(
			(staff) => staff.companyId.toString() === companyId,
		);
		return staff;
	}

	async create(staff: Staff) {
		this.items.push(staff);
	}

	async delete(id: string) {
		this.items = this.items.filter((s) => s.id.toString() !== id);
	}
}
