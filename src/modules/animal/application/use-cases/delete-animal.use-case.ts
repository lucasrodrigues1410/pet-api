import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface DeleteAnimalUseCaseRequest {
	animalId: string;
	userId: string;
}

type DeleteAnimalUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteAnimalUseCase {
	constructor(
		private readonly animalRepository: AnimalRepository,
	) { }

	async execute(
		data: DeleteAnimalUseCaseRequest,
	): Promise<DeleteAnimalUseCaseResponse> {
		const animal = await this.animalRepository.findById(data.animalId);
		if (!animal || animal.userId.toString() !== data.userId) {
			return left(new ResourceNotFoundError("Animal não encontrado"));
		}

		await this.animalRepository.delete(animal.id.toString());
		return right(undefined);
	}
}
