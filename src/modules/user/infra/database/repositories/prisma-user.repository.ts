import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { PrismaUserMapper } from "../mappers/prisma-user.mapper";

@Injectable()
export class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(email) {
		const response = await this.prisma.user.findFirst({
			where: { email },
			include: {
				avatar: true,
			},
		});

		if (!response) {
			return null;
		}

		return PrismaUserMapper.toDomain(response);
	}

	async findById(id: string): Promise<User | null> {
		const response = await this.prisma.user.findFirst({
			where: { id },
		});

		if (!response) {
			return null;
		}

		return PrismaUserMapper.toDomain(response);
	}

	async create(user: User): Promise<void> {
		const data = PrismaUserMapper.toPrisma(user);
		await this.prisma.user.create({
			data: data,
		});
	}

	async update(user: User): Promise<void> {
		const data = PrismaUserMapper.toPrisma(user);
		await this.prisma.user.update({
			where: { id: user.id.toString() },
			data: data,
		});
	}
}
