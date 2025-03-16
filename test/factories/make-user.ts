import { User, UserProps } from "src/modules/user/domain/entities/user.entity";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { UserPrismaMapper } from "src/modules/user/infra/database/prisma/mappers/user.mapper";

export function makeUser(override: Partial<User> = {}, id?: number) {
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

	async makePrismaStudent(data: Partial<UserProps> = {}): Promise<User> {
		const user = makeUser(data);

		await this.prisma.user.create({
			data: UserPrismaMapper.toPrisma(user),
		});

		return user;
	}
}
