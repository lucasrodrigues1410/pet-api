import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";
import { Animal } from "../../../domain/entities/animal.entity";
import { AnimalRepository } from "../../../domain/repositories/animal.repository";
import { PrismaAnimalMapper } from "../mappers/prisma-animal.mapper";

@Injectable()
export class AnimalPrismaRepository implements AnimalRepository {
	private readonly logger = new Logger(AnimalPrismaRepository.name);

	constructor(private prismaService: PrismaService) {}

	async create(animal: Animal) {
		this.logger.log(
			`Creating animal in database. ID: ${animal.id.toString()}, Name: ${animal.name}`,
		);

		try {
			const data = PrismaAnimalMapper.toPrisma(animal);
			const response = await this.prismaService.animal.create({
				data,
			});

			this.logger.log(
				`Animal created successfully in database. ID: ${response.id}`,
			);
			return PrismaAnimalMapper.toDomain(response);
		} catch (error) {
			this.logger.error(
				`Database error creating animal ${animal.id.toString()}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	async update(animalId: string, data: Partial<Omit<Animal, "id">>) {
		this.logger.log(`Updating animal in database. ID: ${animalId}`);
		this.logger.debug(`Update data: ${JSON.stringify(data)}`);

		try {
			const response = await this.prismaService.animal.update({
				where: { id: animalId, deletedAt: null },
				data: PrismaAnimalMapper.toPrismaUpdate(data),
			});

			this.logger.log(
				`Animal updated successfully in database. ID: ${response.id}`,
			);
			return PrismaAnimalMapper.toDomain(response);
		} catch (error) {
			this.logger.error(
				`Database error updating animal ${animalId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	async findById(animalId: string): Promise<Animal | null> {
		this.logger.debug(`Finding animal by ID in database: ${animalId}`);

		try {
			const response = await this.prismaService.animal.findUnique({
				where: { id: animalId.toString(), deletedAt: null },
			});

			if (!response) {
				this.logger.debug(`Animal not found in database. ID: ${animalId}`);
				return null;
			}

			this.logger.debug(`Animal found in database. ID: ${response.id}`);
			return PrismaAnimalMapper.toDomain(response);
		} catch (error) {
			this.logger.error(
				`Database error finding animal ${animalId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	async delete(petId: string) {
		this.logger.log(`Soft deleting animal in database. ID: ${petId}`);

		try {
			await this.prismaService.animal.update({
				where: { id: petId },
				data: { deletedAt: new Date() },
			});

			this.logger.log(
				`Animal soft deleted successfully in database. ID: ${petId}`,
			);
		} catch (error) {
			this.logger.error(
				`Database error deleting animal ${petId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}

	async fetchAllAnimalsByUser(params: { userId: string } & PaginationQuery) {
		this.logger.log(
			`Fetching animals by user from database. UserId: ${params.userId}, Page: ${params.page}, Limit: ${params.limit}`,
		);

		try {
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

			this.logger.log(
				`Successfully fetched ${items.length} animals for user ${params.userId} from database`,
			);
			this.logger.debug(`Pagination meta: ${JSON.stringify(rest)}`);

			return {
				items: items.map((animal) => PrismaAnimalMapper.toDomain(animal)),
				...rest,
			};
		} catch (error) {
			this.logger.error(
				`Database error fetching animals for user ${params.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
