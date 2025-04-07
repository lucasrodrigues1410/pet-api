import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { AssetRepository } from "../../domain/repositories/asset.repository";

interface DeleteAssetByIdRequest {
	id: string;
}

type DeleteAssetByIdResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteAssetByIdUseCase {
	constructor(private assetRepository: AssetRepository) {}

	async execute({
		id,
	}: DeleteAssetByIdRequest): Promise<DeleteAssetByIdResponse> {
		const asset = await this.assetRepository.existsByIds([id]);
		if (!asset) {
			return left(new ResourceNotFoundError("Asset not found"));
		}

		await this.assetRepository.delete(id);
		return right(undefined);
	}
}
