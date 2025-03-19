import { Prisma, User as PrismaUser } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { User } from "src/modules/user/domain/entities/user.entity";

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
