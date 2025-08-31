import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { User, UserProps } from "src/modules/user/domain/entities/user.entity";
import { PrismaUserMapper } from "src/modules/user/infra/database/mappers/prisma-user.mapper";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export function makeUser(
	override: Partial<UserProps & { id?: UniqueEntityID }> = {},
) {
	const user = User.create(
		{
			email: override.email ?? faker.internet.email(),
			name: override.name ?? faker.person.fullName(),
			password: override.password ?? faker.internet.password(),
			type:
				override.type ??
				faker.helpers.arrayElement(["customer", "admin", "company"]),
			avatarAssetId: override.avatarAssetId,
			avatar: override.avatar,
		},
		override.id,
	);

	return user;
}

@Injectable()
export class UserFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
		const user = makeUser(data);

		await this.prisma.user.create({
			data: PrismaUserMapper.toPrisma(user),
		});

		return user;
	}
}
