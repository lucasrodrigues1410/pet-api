import { Prisma, Invite as PrismaInvite } from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Invite } from "@/modules/invite/domain/entities/invite.entity";

export class PrismaInviteMapper {
	static toDomain(prismaInvite: PrismaInvite): Invite {
		return Invite.create({
			userId: new UniqueEntityID(prismaInvite.userId),
			token: prismaInvite.token,
			expiresAt: prismaInvite.expiresAt,
			usedAt: prismaInvite.usedAt ?? undefined,
			createdAt: prismaInvite.createdAt,
			updatedAt: prismaInvite.updatedAt,
			deletedAt: prismaInvite.deletedAt ?? undefined,
		}, new UniqueEntityID(prismaInvite.id));
	}

	static toPrisma(invite: Invite): PrismaInvite {
		return {
			id: invite.id.toString(),
			userId: invite.userId.toString(),
			token: invite.token,
			expiresAt: invite.expiresAt,
			usedAt: invite.usedAt ?? null,
			createdAt: invite.createdAt,
			updatedAt: invite.updatedAt ?? new Date(),
			deletedAt: invite.deletedAt ?? null,
		};
	}

	static toPrismaUpdate(invite: Partial<Invite>): Prisma.InviteUncheckedUpdateInput {
		return {
			usedAt: invite.usedAt ?? null,
			updatedAt: invite.updatedAt ?? new Date(),
			deletedAt: invite.deletedAt ?? null,
		};
	}
}
