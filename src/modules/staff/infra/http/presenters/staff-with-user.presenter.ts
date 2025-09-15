import { Staff } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserPresenter } from "@/modules/user/infra/http/presenters/user.presenter";
import { StaffPresenter } from "./staff.presenter";

export class StaffWithUserPresenter {
	static present(staff: Staff & { user: User }) {
		return {
			...StaffPresenter.present(staff),
			user: UserPresenter.toHTTP(staff.user),
		};
	}
}
