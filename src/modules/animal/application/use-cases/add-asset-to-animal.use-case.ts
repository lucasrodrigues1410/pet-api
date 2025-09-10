import { Injectable } from "@nestjs/common";
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
	constructor(
		private readonly animalRepository: AnimalRepository,
		private readonly uploadAndCreateAsset: UploadAndCreateAssetUseCase,
	) {}

	async execute(
		data: AddAssetToAnimalRequest,
	): Promise<AddAssetToAnimalResponse> {
		const animal = await this.animalRepository.findById(data.animalId);
		if (!animal || animal.userId.toString() !== data.userId) {
			return left(new ResourceNotFoundError());
		}

		const result = await this.uploadAndCreateAsset.execute({
			file: data.file,
			userId: data.userId,
			fileName: `animals/animal-${data.animalId}-user-${data.userId}`,
		});

		if (result.isLeft()) {
			return left(result.value);
		}

		await this.animalRepository.update(data.animalId, {
			assetId: result.value.asset.id,
		});

		return right(undefined);
	}
}
