import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { AuthPresenter } from "./auth.presenter";

type AcceptInviteResult = {
	user: User;
	accessToken: string;
	staffRole?: StaffRole;
	companyId?: string;
};

export class AcceptInvitePresenter {
	static present(result: AcceptInviteResult) {
		return AuthPresenter.presentAcceptInvite(
			result.user,
			result.accessToken,
			result.staffRole,
			result.companyId,
		);
	}
}
