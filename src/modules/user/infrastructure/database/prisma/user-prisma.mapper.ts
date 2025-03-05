import { Prisma, User as PrismaUser } from "@prisma/client";
import { User } from "src/modules/user/domain/entities/user.entity";

export class UserPrismaMapper {
	static toDomain(prismaUser: PrismaUser): User {
		return User.create({
			name: prismaUser.name,
			email: prismaUser.email,
			type: prismaUser.type,
			password: prismaUser.password,
		});
	}

	static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			type: user.type,
		};
	}
}
