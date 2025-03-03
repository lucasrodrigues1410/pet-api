import { Injectable } from "@nestjs/common";
import { AnimalRepository } from "../../../domain/repositories/animal.repository";
import { PrismaService } from "src/common/infrastructure/prisma/prisma.service";
import { Animal } from "../../../domain/entities/animal.entity";
import { AnimalPrismaMapper } from "./animal-prisma.mapper";

@Injectable()
export class AnimalPrismaRepository implements AnimalRepository {
	constructor(private prismaService: PrismaService) {}

	async create(animal: Animal) {
		const data = AnimalPrismaMapper.toPrisma(animal);
		const response = await this.prismaService.animal.create({
			data,
		});
		return AnimalPrismaMapper.toDomain(response);
	}

	async getById(animalId: number): Promise<Animal | null> {
		const response = await this.prismaService.animal.findUnique({
			where: { id: animalId },
		});

		if (!response) {
			return null;
		}

		return AnimalPrismaMapper.toDomain(response);
	}

	async delete(petId: number) {
		await this.prismaService.animal.delete({ where: { id: petId } });
	}

	async getAllByUser(userId: number) {
		const response = await this.prismaService.animal.findMany({
			where: { userId },
		});

		return response.map((animal) => AnimalPrismaMapper.toDomain(animal));
	}
}
