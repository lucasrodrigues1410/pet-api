import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { InviteRepository } from "@/modules/invite/domain/repositories/invite.repository";
import { User } from "@/modules/user/domain/entities/user.entity";

export class InMemoryInviteRepository implements InviteRepository {
	public items: Invite[] = [];

	async create(invite: Invite): Promise<void> {
		this.items.push(invite);
	}

	async findByToken(token: string): Promise<Invite & { user: User } | null> {
		const invite = this.items.find((item) => item.token === token);
		return (invite || null) as Invite & { user: User } | null;
	}

	async update(id: string, invite: Partial<Invite>): Promise<void> {
		const index = this.items.findIndex((item) => item.id.toString() === id);
		if (index !== -1) {
			// Como estamos recebendo a entidade completa já modificada,
			// vamos simplesmente substituir
			this.items[index] = invite as Invite;
		}
	}

	async delete(id: string): Promise<void> {
		const index = this.items.findIndex((item) => item.id.toString() === id);
		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
}
