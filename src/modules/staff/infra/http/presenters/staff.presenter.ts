import { Staff } from "@/modules/staff/domain/entities/staff.entity";

export class StaffPresenter {
	static present(staff: Staff) {
		return {
			id: staff.id.toString(),
			userId: staff.userId.toString(),
			companyId: staff.companyId.toString(),
			role: staff.role,
			createdAt: staff.createdAt.toISOString(),
			updatedAt: staff.updatedAt?.toISOString(),
			deletedAt: staff.deletedAt?.toISOString(),
		};
	}
}
