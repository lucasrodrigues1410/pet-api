import { Invite } from "@/modules/invite/domain/entities/invite.entity";

export class InvitePresenter {
	static present(invite: Invite) {
		return {
			id: invite.id.toString(),
			userId: invite.userId.toString(),
			token: invite.token,
			expiresAt: invite.expiresAt.toISOString(),
			usedAt: invite.usedAt?.toISOString(),
		};
	}
}
