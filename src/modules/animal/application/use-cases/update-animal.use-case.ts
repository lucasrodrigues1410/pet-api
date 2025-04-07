import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { EventDispatcher } from "@/core/domain/interfaces/event-dispatcher.interface";
import { AssetUnlinkedEvent } from "@/modules/asset/domain/events/asset-unlinked.event";
import { AssetRepository } from "@/modules/asset/domain/repositories/asset.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface UpdateAnimalUseCaseRequest {
	id: string;
	name?: string | null;
	birthdate?: Date | null;
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
		private readonly eventDispatcher: EventDispatcher,
	) {}

	async execute(
		data: UpdateAnimalUseCaseRequest,
	): Promise<UpdateAnimalUseCaseResponse> {
		const animal = await this.animalRepository.getById(data.id);
		if (!animal) {
			return left(new ResourceNotFoundError());
		}

		const newAnimal = Animal.create(
			{
				breedId: animal.breedId,
				name: data.name ?? animal.name,
				birthdate: data.birthdate ?? animal.birthdate,
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
			this.eventDispatcher.dispatch(new AssetUnlinkedEvent(`${data.assetId}`));
		}

		const result = await this.animalRepository.update(newAnimal);
		return right({
			animal: result,
		});
	}
}
