import { Staff } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { StaffWithUserPresenter } from "./staff-with-user.presenter";

export class StaffListPresenter {
	static present(staff: PaginationResult<Staff & { user: User }>) {
		return {
			items: staff.items.map((staffMember) =>
				StaffWithUserPresenter.present(staffMember),
			),
			meta: staff.meta,
		};
	}
}
