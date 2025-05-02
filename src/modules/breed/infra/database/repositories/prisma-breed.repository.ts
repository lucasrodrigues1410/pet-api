import { Prisma } from "@/prisma-generated/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { BreedRepository } from "src/modules/breed/domain/repositories/breed.repository";
import { PrismaBreedMapper } from "../mappers/prisma-breed.mapper";

@Injectable()
export class PrismaBreedRepository implements BreedRepository {
	constructor(private prismaService: PrismaService) {}

	async getAll(params: Parameters<BreedRepository["getAll"]>[0]) {
		const options = {
			name: {
				contains: params.query,
				mode: "insensitive",
			},
		} as Prisma.BreedWhereInput;

		const response = await this.prismaService.breed.findMany({
			where: options,
		});
		return response.map(PrismaBreedMapper.toDomain);
	}

	async create(breed: Breed): Promise<void> {
		await this.prismaService.breed.create({
			data: PrismaBreedMapper.toPrisma(breed),
		});
	}
}
