import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { PrismaBreedMapper } from "@/modules/breed/infra/database/mappers/prisma-breed.mapper";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";
import { Animal } from "../../../domain/entities/animal.entity";
import { AnimalRepository } from "../../../domain/repositories/animal.repository";
import { PrismaAnimalMapper } from "../mappers/prisma-animal.mapper";

@Injectable()
export class AnimalPrismaRepository implements AnimalRepository {
	constructor(private prismaService: PrismaService) {}

	async create(animal: Animal) {
		console.log(animal.toObject());
		const data = PrismaAnimalMapper.toPrisma(animal);
		const response = await this.prismaService.animal.create({ data });

		return PrismaAnimalMapper.toDomain(response);
	}

	async update(animalId: string, data: Partial<Omit<Animal, "id">>) {
		const response = await this.prismaService.animal.update({
			where: { id: animalId, deletedAt: null },
			data: PrismaAnimalMapper.toPrismaUpdate(data),
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

	async findByIdWithRelations(
		animalId: string,
	): Promise<(Animal & { breed: Breed; asset?: Asset }) | null> {
		const response = await this.prismaService.animal.findUnique({
			where: { id: animalId.toString(), deletedAt: null },
			include: { breed: true, asset: true },
		});
		if (!response) {
			return null;
		}
		return Object.assign(PrismaAnimalMapper.toDomain(response), {
			breed: PrismaBreedMapper.toDomain(response.breed),
			asset: response.asset
				? PrismaAssetMapper.toDomain(response.asset)
				: undefined,
		});
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
					include: { breed: true, asset: true },
				}),
			() =>
				this.prismaService.animal.count({
					where: { userId: params.userId, deletedAt: null },
				}),
			params,
		);

		return {
			items: items.map((animal) => {
				return Object.assign(PrismaAnimalMapper.toDomain(animal), {
					breed: PrismaBreedMapper.toDomain(animal.breed),
					asset: animal.asset
						? PrismaAssetMapper.toDomain(animal.asset)
						: undefined,
				});
			}),
			...rest,
		};
	}
}
