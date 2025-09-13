import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { User } from "@/modules/user/domain/entities/user.entity";

export class InviteEmployeeResponsePresenter {
	static present(invite: Invite, user: User) {
		return {
			inviteId: invite.id.toString(),
			token: invite.token,
			message: `Convite enviado para ${user.name} (${user.email}). O convite expira em 7 dias.`,
		};
	}
}
