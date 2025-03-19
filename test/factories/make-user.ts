import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { User, UserProps } from "src/modules/user/domain/entities/user.entity";
import { PrismaUserMapper } from "src/modules/user/infra/database/mappers/prisma-user.mapper";

export function makeUser(override: Partial<User> = {}, id?: UniqueEntityID) {
	const student = User.create(
		{
			email: faker.internet.email(),
			name: faker.person.fullName(),
			password: faker.internet.password(),
			type: faker.helpers.arrayElement(["CUSTOMER", "ADMIN", "COMPANY"]),
			...override,
		},
		id,
	);

	return student;
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
