import { User } from "@/modules/user/domain/entities/user.entity";

export class SignInCustomerPresenter {
	static toHttp(user: User & { accessToken: string }) {
		return {
			id: user.id.toValue(),
			name: user.name,
			email: user.email,
			type: user.type,
			accessToken: user.accessToken,
		};
	}
}