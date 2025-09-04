import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { InviteRepository } from "@/modules/invite/domain/repositories/invite.repository";
import { PrismaUserMapper } from "@/modules/user/infra/database/mappers/prisma-user.mapper";
import { PrismaInviteMapper } from "../mappers/prisma-invite.mapper";

@Injectable()
export class PrismaInviteRepository implements InviteRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(invite: Invite): Promise<void> {
		await this.prisma.invite.create({
			data: PrismaInviteMapper.toPrisma(invite),
		});
	}

	async findByToken(token: string) {
		const invite = await this.prisma.invite.findUnique({
			where: { token },
			include: {
				user: true,
			},
		});

		if (!invite) {
			return null;
		}

		return Object.assign(PrismaInviteMapper.toDomain(invite), {
			user: PrismaUserMapper.toDomain(invite.user),
		});
	}

	async update(id: string, invite: Partial<Invite>) {
		await this.prisma.invite.update({
			where: { id },
			data: PrismaInviteMapper.toPrismaUpdate(invite),
		});
	}

	async delete(id: string) {
		await this.prisma.invite.update({
			where: { id },
			data: {
				deletedAt: new Date(),
			},
		});
	}
}
