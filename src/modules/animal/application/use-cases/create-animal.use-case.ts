import { Injectable } from "@nestjs/common";
import { Either, right } from "src/common/either";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface CreateAnimalCaseRequest {
	name: string;
	birthdate?: Date | null;
	breedId: number;
	weight: number;
	userId: number;
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
		const animal = Animal.create(data);
		const result = await this.animalRepository.create(animal);

		return right({
			animal: result,
		});
	}
}
