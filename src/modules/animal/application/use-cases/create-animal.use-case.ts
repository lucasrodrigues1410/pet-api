import { Injectable, Logger } from "@nestjs/common";
import { subYears } from "date-fns";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface CreateAnimalCaseRequest {
	name: string;
	age?: number | null;
	breedId: string;
	weight: number;
	userId: string;
}

type CreateAnimalCaseResponse = Either<
	ResourceNotFoundError,
	{ animal: Animal }
>;

@Injectable()
export class CreateAnimalUseCase {
	private readonly logger = new Logger(CreateAnimalUseCase.name);

	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		data: CreateAnimalCaseRequest,
	): Promise<CreateAnimalCaseResponse> {
		this.logger.log(`Executing create animal use case for user ${data.userId}`);

		try {
			const animal = Animal.create({
				name: data.name,
				birthdate: data.age ? subYears(new Date(), data.age) : null,
				breedId: new UniqueEntityID(data.breedId),
				weight: data.weight,
				userId: new UniqueEntityID(data.userId),
			});

			this.logger.debug(
				`Animal entity created with ID: ${animal.id.toString()}`,
			);

			const result = await this.animalRepository.create(animal);

			this.logger.log(
				`Animal created successfully in repository. ID: ${result.id.toString()}, Name: ${result.name}`,
			);

			return right({ animal: result });
		} catch (error) {
			this.logger.error(
				`Error creating animal for user ${data.userId}`,
				(error as Error).stack,
			);
			throw error;
		}
	}
}
