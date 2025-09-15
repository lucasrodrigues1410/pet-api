import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { InviteWithUserPresenter } from "./invite-with-user.presenter";

interface ValidateInviteData {
	invite: Invite & { user: User };
	isValid: boolean;
	isExpired: boolean;
	isUsed: boolean;
}

export class ValidateInviteResponsePresenter {
	static present(data: ValidateInviteData) {
		let message = "";
		if (data.isValid) {
			message = "Convite válido";
		} else if (data.isExpired) {
			message = "Convite expirado";
		} else if (data.isUsed) {
			message = "Convite já foi usado";
		}

		return {
			isValid: data.isValid,
			isExpired: data.isExpired,
			isUsed: data.isUsed,
			invite: data.isValid
				? InviteWithUserPresenter.present(data.invite)
				: undefined,
			message,
		};
	}
}
