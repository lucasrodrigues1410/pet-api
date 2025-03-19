import { Injectable } from "@nestjs/common";
import { Either, right } from "src/core/either";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface CreateAnimalCaseRequest {
	name: string;
	birthdate?: Date | null;
	breedId: string;
	weight: number;
	userId: string;
}

type CreateAnimalCaseResponse = Either<
	null,
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
