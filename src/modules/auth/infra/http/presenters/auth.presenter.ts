import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { User, UserType } from "@/modules/user/domain/entities/user.entity";

export class AuthPresenter {
	static presentSignIn(
		user: User & {
			accessToken: string;
			staffRole?: StaffRole;
			companyId?: string;
		},
	) {
		return {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			type: user.type,
			accessToken: user.accessToken,
			avatar: user.avatar?.url,
			staffRole: user.staffRole,
			companyId: user.companyId,
		};
	}

	static presentSession(payload: {
		sub: string;
		name: string;
		email: string;
		type: UserType;
		companyId?: string;
		role?: StaffRole;
	}) {
		return {
			id: payload.sub,
			name: payload.name,
			email: payload.email,
			type: payload.type,
			companyId: payload.companyId,
			role: payload.role,
		};
	}

	static presentAcceptInvite(
		user: User,
		accessToken: string,
		staffRole?: StaffRole,
		companyId?: string,
	) {
		return {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			accessToken,
			staffRole,
			companyId,
			avatar: user.avatar?.url,
			type: user.type,
		};
	}
}
