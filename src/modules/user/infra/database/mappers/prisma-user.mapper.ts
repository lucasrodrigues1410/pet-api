import { Prisma, User as PrismaUser } from "prisma/generated/client";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export class PrismaUserMapper {
	static toDomain(prismaUser: PrismaUser): User {
		return User.create(
			{
				name: prismaUser.name,
				email: prismaUser.email,
				type: prismaUser.type,
				password: prismaUser.password,
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
		};
	}
}
