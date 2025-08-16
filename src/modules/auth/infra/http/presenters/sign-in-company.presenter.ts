import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";

export class SignInCompanyPresenter {
	static toHttp(user: User & {
		accessToken: string;
		staffRole: StaffRole;
		companyId: string;
	}) {
		return {
			id: user.id.toValue(),
			name: user.name,
			email: user.email,
			type: user.type,
			accessToken: user.accessToken,
			staffRole: user.staffRole,
			companyId: user.companyId,
		};
	}
}