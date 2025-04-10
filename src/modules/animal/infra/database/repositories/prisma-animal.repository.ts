import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Animal } from "../../../domain/entities/animal.entity";
import { AnimalRepository } from "../../../domain/repositories/animal.repository";
import { AnimalPrismaMapper } from "../mappers/prisma-animal.mapper";
import { paginate } from "@/core/pagination/paginator";
import { PaginationParams } from "@/core/pagination/pagination-params";

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

	async update(animal: Animal) {
		const data = AnimalPrismaMapper.toPrisma(animal);
		const response = await this.prismaService.animal.update({
			where: { id: animal.id.toString(), deletedAt: null },
			data,
		});
		return AnimalPrismaMapper.toDomain(response);
	}

	async getById(animalId: string): Promise<Animal | null> {
		const response = await this.prismaService.animal.findUnique({
			where: { id: animalId.toString(), deletedAt: null },
		});

		if (!response) {
			return null;
		}

		return AnimalPrismaMapper.toDomain(response);
	}

	async delete(petId: string) {
		await this.prismaService.animal.update({
			where: { id: petId },
			data: { deletedAt: new Date() },
		});
	}

	async fetchAllAnimalsByUser(params: { userId: string } & PaginationParams) {
		const { items, ...rest } = await paginate(
			({ skip, take }) =>
				this.prismaService.animal.findMany({
					skip,
					take,
					orderBy: { createdAt: "desc" },
					where: { userId: params.userId, deletedAt: null },
					include: {
						breed: true,
					},
				}),
			() => this.prismaService.animal.count(),
			params,
		);

		return {
			items: items.map((animal) => AnimalPrismaMapper.toDomain(animal)),
			...rest,
		};
	}
}
