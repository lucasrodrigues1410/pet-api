import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserPresenter } from "@/modules/user/infra/http/presenters/user.presenter";
import { InvitePresenter } from "./invite.presenter";

export class InviteWithUserPresenter {
	static present(invite: Invite & { user: User }) {
		return {
			...InvitePresenter.present(invite),
			user: UserPresenter.toHTTP(invite.user),
		};
	}
}
