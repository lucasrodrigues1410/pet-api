import { Prisma, User as PrismaUser } from "prisma/generated/client";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export class PrismaUserMapper {
	static toDomain(prismaUser: PrismaUser): User {
		return User.create(
			{
				name: prismaUser.name,
				email: prismaUser.email,
				password: prismaUser.password ?? undefined,
				avatarUrl: prismaUser.avatarUrl ?? undefined,
				authProviderId: prismaUser.authProviderId ?? undefined,
			},
			new UniqueEntityID(prismaUser.id),
		);
	}

	static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
		const data: any = {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			password: user.password,
			avatarUrl: user.avatarUrl ?? undefined,
			authProviderId: user.authProviderId ?? undefined,
		};

		return data;
	}

	static toPrismaUpdate(user: Partial<User>): Prisma.UserUncheckedUpdateInput {
		const data: any = {
			name: user.name,
			email: user.email,
			password: user.password,
			avatarUrl: user.avatarUrl ?? undefined,
			authProviderId: user.authProviderId ?? undefined,
			updatedAt: new Date(),
		};

		return data;
	}
}
