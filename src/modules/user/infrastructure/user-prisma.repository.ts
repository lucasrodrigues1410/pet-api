import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { IUserRepository } from "../domain/repositories/user.repository";
import { User } from "../domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserPrismaRepository implements IUserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findUserByEmail(email): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { email },
		});

		if (!response) {
			return null;
		}

		return response;
	}

	async findById(id: number): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { id },
		});

		if (!response) {
			return null;
		}

		return response;
	}

	async save(user: User): Promise<void> {
		await this.prisma.user.create({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				type: user.type,
				password: user.password,
			},
		});
	}
}
