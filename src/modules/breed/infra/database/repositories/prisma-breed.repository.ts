import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { BreedRepository } from "src/modules/breed/domain/repositories/breed.repository";
import { PrismaBreedMapper } from "../mappers/prisma-breed.mapper";

@Injectable()
export class PrismaBreedRepository implements BreedRepository {
	constructor(private prismaService: PrismaService) {}

	async getAll(): Promise<Breed[]> {
		await this.prismaService.breed.findMany();
		const response = await this.prismaService.breed.findMany();
		return response.map((breed) => PrismaBreedMapper.toDomain(breed));
	}

	async create(breed: Breed): Promise<void> {
		await this.prismaService.breed.create({
			data: PrismaBreedMapper.toPrisma(breed),
		});
	}
}
