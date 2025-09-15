import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { AuthPresenter } from "./auth.presenter";

type SessionPayload = {
	sub: string;
	name: string;
	email: string;
	type: UserType;
	companyId?: string;
	role?: StaffRole;
};

export class SessionPresenter {
	static present(payload: SessionPayload) {
		return AuthPresenter.presentSession(payload);
	}
}
