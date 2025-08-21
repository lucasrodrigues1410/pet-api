import { UserPayload } from "../../strategies/jwt.strategy";
import { SessionResponse } from "../dtos/session.dto";

export class SessionPresenter {
	static toHTTP(userPayload: UserPayload): SessionResponse {
		return {
			id: userPayload.sub,
			email: userPayload.email,
			name: userPayload.name,
			type: userPayload.type as "CUSTOMER" | "COMPANY" | "ADMIN",
			companyId: userPayload.companyId,
			role: userPayload.role,
		};
	}
}
