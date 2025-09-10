import {
	Prisma,
	Asset as PrismaAsset,
	User as PrismaUser,
} from "prisma/generated/client";
import { User, UserType } from "src/modules/user/domain/entities/user.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";

export class PrismaUserMapper {
	static toDomain(
		prismaUser: PrismaUser & { avatar?: PrismaAsset | null | undefined },
	): User {
		return User.create(
			{
				name: prismaUser.name,
				email: prismaUser.email,
				type: prismaUser.type as UserType,
				password: prismaUser.password,
				avatar: prismaUser.avatar
					? PrismaAssetMapper.toDomain(prismaUser.avatar)
					: undefined,
				avatarAssetId: prismaUser.avatarAssetId ?? undefined,
			},
			new UniqueEntityID(prismaUser.id),
		);
	}

	static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
		return {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			password: user.password,
			type: user.type,
			avatarAssetId: user.avatarAssetId ?? undefined,
		};
	}

	static toPrismaUpdate(user: Partial<User>): Prisma.UserUncheckedUpdateInput {
		return {
			name: user.name,
			email: user.email,
			password: user.password,
			avatarAssetId: user.avatarAssetId ?? undefined,
			updatedAt: new Date(),
		};
	}
}
