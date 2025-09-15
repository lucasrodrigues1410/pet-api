import { AuthPresenter } from "./auth.presenter";

type SessionPayload = {
	sub: string;
	name: string;
	email: string;
	type: string;
	companyId?: string;
	role?: string;
};

export class SessionPresenter {
	static present(payload: SessionPayload) {
		return AuthPresenter.presentSession(payload);
	}
}
