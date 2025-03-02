import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { IUserRepository } from "../domain/repositories/user.repository";
import { User, UserType } from "../domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserPrismaRepository implements IUserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findUserByEmail(email: string): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { email },
		});

		if (!response) {
			return null;
		}

		return {
			id: response.id,
			name: response.name,
			email: response.email,
			type: response.type as UserType,
			password: response.password,
			createdAt: response.createdAt,
			updatedAt: response.updatedAt
		};
	}

	async findById(id: number): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { id },
		});

		if (!response) {
			return null;
		}

		return {
			id: response.id,
			name: response.name,
			email: response.email,
			type: response.type as UserType,
			password: response.password,
			createdAt: response.createdAt,
			updatedAt: response.updatedAt,
		};
	}
}
