import { Injectable, Logger } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
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
	private readonly logger = new Logger(UpdateAnimalUseCase.name);

	constructor(
		private readonly animalRepository: AnimalRepository,
		private readonly assetRepository: AssetRepository,
	) {}

	async execute(
		data: UpdateAnimalUseCaseRequest,
	): Promise<UpdateAnimalUseCaseResponse> {
		this.logger.log(`Executing update animal use case. AnimalId: ${data.animalId}, UserId: ${data.userId}`);
		this.logger.debug(`Update animal data: ${JSON.stringify(data)}`);

		try {
			const animal = await this.animalRepository.findById(data.animalId);

			if (!animal) {
				this.logger.warn(`Animal not found for update. AnimalId: ${data.animalId}`);
				return left(new ResourceNotFoundError());
			}

			if (animal.userId.toString() !== data.userId) {
				this.logger.warn(`User ${data.userId} attempted to update animal ${data.animalId} owned by user ${animal.userId.toString()}`);
				return left(new ResourceNotFoundError());
			}

			this.logger.debug(`Animal found and ownership verified. Proceeding with update`);

			const newAnimal = Animal.create(
				{
					breedId: animal.breedId,
					name: data.name ?? animal.name,
					birthdate: data.birthdate ? new Date(data.birthdate) : null,
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
				this.logger.warn(`Asset not found for update. AssetId: ${data.assetId}`);
				return left(new ResourceNotFoundError());
			}

			const updatedAnimal = await this.animalRepository.update(
				newAnimal.id.toString(),
				newAnimal,
			);
			
			this.logger.log(`Animal ${data.animalId} updated successfully`);
			this.logger.debug(`Updated animal data: ${JSON.stringify(updatedAnimal.toObject())}`);
			
			return right({
				animal: updatedAnimal,
			});
		} catch (error) {
			this.logger.error(`Error updating animal ${data.animalId} for user ${data.userId}`, error instanceof Error ? error.stack : String(error));
			throw error;
		}
	}
}
