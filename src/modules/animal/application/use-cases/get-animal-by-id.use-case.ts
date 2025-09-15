import { Injectable } from "@nestjs/common";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface GetAnimalByIdUseCaseRequest {
	animalId: string;
	userId: string;
}

type GetAnimalByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{ animal: Animal & { breed: Breed; asset?: Asset } }
>;

@Injectable()
export class GetAnimalByIdUseCase {
	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		data: GetAnimalByIdUseCaseRequest,
	): Promise<GetAnimalByIdUseCaseResponse> {
		const animal = await this.animalRepository.findByIdWithRelations(
			data.animalId,
		);

		if (!animal || animal.userId.toString() !== data.userId) {
			return left(new ResourceNotFoundError());
		}

		return right({ animal });
	}
}
