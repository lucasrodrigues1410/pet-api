import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { AuthPresenter } from "./auth.presenter";

type SignInResult = User & {
	accessToken: string;
	staffRole?: StaffRole;
	companyId?: string;
};

export class SignInPresenter {
	static present(result: SignInResult) {
		return AuthPresenter.presentSignIn(result);
	}
}
