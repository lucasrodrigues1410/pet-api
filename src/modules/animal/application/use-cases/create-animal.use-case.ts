import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AssetRepository } from "@/modules/asset/domain/repositories/asset.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface CreateAnimalCaseRequest {
	name: string;
	birthdate?: Date | string | null;
	breedId: string;
	weight: number;
	userId: string;
	assetId?: string;
}

type CreateAnimalCaseResponse = Either<
	ResourceNotFoundError,
	{
		animal: Animal;
	}
>;

@Injectable()
export class CreateAnimalUseCase {
	constructor(
		private readonly animalRepository: AnimalRepository,
		private readonly assetRepository: AssetRepository,
	) {}

	async execute(
		data: CreateAnimalCaseRequest,
	): Promise<CreateAnimalCaseResponse> {
		const animal = Animal.create({
			name: data.name,
			birthdate: data.birthdate,
			breedId: new UniqueEntityID(data.breedId),
			weight: data.weight,
			userId: new UniqueEntityID(data.userId),
			assetId: data.assetId ? new UniqueEntityID(data.assetId) : undefined,
		});
		const existsAsset = animal.assetId
			? await this.assetRepository.existsByIds([animal.assetId.toString()])
			: true;

		if (!existsAsset) {
			return left(new ResourceNotFoundError());
		}

		const result = await this.animalRepository.create(animal);
		return right({
			animal: result,
		});
	}
}
