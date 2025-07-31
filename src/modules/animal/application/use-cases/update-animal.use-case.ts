import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AssetUnlinkedEvent } from "@/modules/asset/domain/events/asset-unlinked.event";
import { AssetEventDispatcher } from "@/modules/asset/domain/interfaces/asset-event-dispatch.interface";
import { AssetRepository } from "@/modules/asset/domain/repositories/asset.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface UpdateAnimalUseCaseRequest {
	animalId: string;
	userId: string;
	name?: string | null;
	birthdate?: string | null;
	weight?: number | null;
	assetId?: string | null;
}

type UpdateAnimalUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		animal: Animal;
	}
>;

@Injectable()
export class UpdateAnimalUseCase {
	constructor(
		private readonly animalRepository: AnimalRepository,
		private readonly assetRepository: AssetRepository,
		private readonly eventDispatcher: AssetEventDispatcher,
	) {}

	async execute(
		data: UpdateAnimalUseCaseRequest,
	): Promise<UpdateAnimalUseCaseResponse> {
		const animal = await this.animalRepository.findById(data.animalId);
		if (!animal || animal.userId.toString() !== data.userId) {
			return left(new ResourceNotFoundError("Animal não encontrado"));
		}

		const newAnimal = Animal.create(
			{
				breedId: animal.breedId,
				name: data.name ?? animal.name,
				birthdate: data.birthdate
					? new Date(data.birthdate)
					: animal.birthdate,
				weight: data.weight ?? animal.weight,
				assetId: data.assetId
					? new UniqueEntityID(data.assetId)
					: animal.assetId,
				userId: animal.userId,
			},
			animal.id,
		);

		const existsAsset = data.assetId
			? await this.assetRepository.existsByIds([data.assetId.toString()])
			: true;

		if (!existsAsset) {
			return left(new ResourceNotFoundError());
		}

		if (data.assetId && data.assetId !== animal.assetId?.toString()) {
			this.eventDispatcher.dispatch(
				new AssetUnlinkedEvent(`${data.assetId}`, data.userId),
			);
		}

		const result = await this.animalRepository.update(
			newAnimal.id.toString(),
			newAnimal,
		);
		return right({
			animal: result,
		});
	}
}
