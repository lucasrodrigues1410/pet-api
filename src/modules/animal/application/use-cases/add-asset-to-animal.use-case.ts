import { Injectable, Logger } from "@nestjs/common";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface AddAssetToAnimalRequest {
	userId: string;
	animalId: string;
	file: Express.Multer.File;
}

type AddAssetToAnimalResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class AddAssetToAnimalUseCase {
	private readonly logger = new Logger(AddAssetToAnimalUseCase.name);

	constructor(
		private readonly animalRepository: AnimalRepository,
		private readonly uploadAndCreateAsset: UploadAndCreateAssetUseCase,
	) {}

	async execute(
		data: AddAssetToAnimalRequest,
	): Promise<AddAssetToAnimalResponse> {
		this.logger.log(
			`Executing add asset to animal use case. AnimalId: ${data.animalId}, UserId: ${data.userId}`,
		);
		this.logger.debug(
			`File info: ${data.file.originalname}, Size: ${data.file.size} bytes, MimeType: ${data.file.mimetype}`,
		);

		try {
			const animal = await this.animalRepository.findById(data.animalId);

			if (!animal) {
				this.logger.warn(
					`Animal not found for asset addition. AnimalId: ${data.animalId}`,
				);
				return left(new ResourceNotFoundError());
			}

			if (animal.userId.toString() !== data.userId) {
				this.logger.warn(
					`User ${data.userId} attempted to add asset to animal ${data.animalId} owned by user ${animal.userId.toString()}`,
				);
				return left(new ResourceNotFoundError());
			}

			this.logger.debug(
				`Animal found and ownership verified. Proceeding with asset addition`,
			);

			const result = await this.uploadAndCreateAsset.execute({
				file: data.file,
				userId: data.userId,
				fileName: `animals/animal-${data.animalId}-user-${data.userId}`,
			});

			if (result.isLeft()) {
				this.logger.error(
					`Failed to create asset for animal ${data.animalId}. Error: ${result.value.message}`,
				);
				return left(result.value);
			}

			this.logger.debug(
				`Asset created successfully. AssetId: ${result.value.asset.id.toString()}`,
			);

			await this.animalRepository.update(data.animalId, {
				assetId: result.value.asset.id,
			});

			this.logger.log(
				`Asset ${result.value.asset.id.toString()} added successfully to animal ${data.animalId}`,
			);

			return right(undefined);
		} catch (error) {
			this.logger.error(
				`Error adding asset to animal ${data.animalId} for user ${data.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
