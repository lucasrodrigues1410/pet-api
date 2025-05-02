import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";
import { Injectable } from "@nestjs/common";
import { Animal } from "../../../domain/entities/animal.entity";
import { AnimalRepository } from "../../../domain/repositories/animal.repository";
import { PrismaAnimalMapper } from "../mappers/prisma-animal.mapper";

@Injectable()
export class AnimalPrismaRepository implements AnimalRepository {
	constructor(private prismaService: PrismaService) {}

	async create(animal: Animal) {
		const data = PrismaAnimalMapper.toPrisma(animal);
		const response = await this.prismaService.animal.create({
			data,
		});
		return PrismaAnimalMapper.toDomain(response);
	}

	async update(animal: Animal) {
		const data = PrismaAnimalMapper.toPrisma(animal);
		const response = await this.prismaService.animal.update({
			where: { id: animal.id.toString(), deletedAt: null },
			data,
		});
		return PrismaAnimalMapper.toDomain(response);
	}

	async findById(animalId: string): Promise<Animal | null> {
		const response = await this.prismaService.animal.findUnique({
			where: { id: animalId.toString(), deletedAt: null },
		});

		if (!response) {
			return null;
		}

		return PrismaAnimalMapper.toDomain(response);
	}

	async delete(petId: string) {
		await this.prismaService.animal.update({
			where: { id: petId },
			data: { deletedAt: new Date() },
		});
	}

	async fetchAllAnimalsByUser(params: { userId: string } & PaginationQuery) {
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
			items: items.map((animal) => PrismaAnimalMapper.toDomain(animal)),
			...rest,
		};
	}
}
