import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserPrismaMapper } from "./user-prisma.mapper";

@Injectable()
export class UserPrismaRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(email): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { email },
		});

		if (!response) {
			return null;
		}

		return UserPrismaMapper.toDomain(response);
	}

	async findById(id: number): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { id },
		});

		if (!response) {
			return null;
		}

		return UserPrismaMapper.toDomain(response);
	}

	async create(user: User): Promise<void> {
		const data = UserPrismaMapper.toPrisma(user);
		await this.prisma.user.create({
			data: data,
		});
	}
}
