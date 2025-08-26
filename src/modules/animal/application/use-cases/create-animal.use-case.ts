import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface CreateAnimalCaseRequest {
	name: string;
	birthdate?: Date | string | null;
	breedId: string;
	weight: number;
	userId: string;
}

type CreateAnimalCaseResponse = Either<
	ResourceNotFoundError,
	{
		animal: Animal;
	}
>;

@Injectable()
export class CreateAnimalUseCase {
	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		data: CreateAnimalCaseRequest,
	): Promise<CreateAnimalCaseResponse> {
		const animal = Animal.create({
			name: data.name,
			birthdate: data.birthdate,
			breedId: new UniqueEntityID(data.breedId),
			weight: data.weight,
			userId: new UniqueEntityID(data.userId),
		});

		const result = await this.animalRepository.create(animal);
		return right({
			animal: result,
		});
	}
}
