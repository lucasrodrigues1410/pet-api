import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { Uploader } from "../../domain/storage/uploader";

interface DeleteAssetByIdRequest {
	assetId: string;
	userId: string;
}

type DeleteAssetByIdResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class DeleteAssetByIdUseCase {
	constructor(
		private assetRepository: AssetRepository,
		private uploader: Uploader,
	) {}

	async execute({
		assetId,
		userId,
	}: DeleteAssetByIdRequest): Promise<DeleteAssetByIdResponse> {
		const asset = await this.assetRepository.findById(assetId);
		if (!asset || asset.userId.toString() !== userId) {
			return left(new ResourceNotFoundError("Asset não encontrado"));
		}

		//TODO: Implementar UofW para deletar o asset e o arquivo
		await this.assetRepository.delete(assetId);
		if (asset.fileId) {
			await this.uploader.delete(asset.fileId);
		}
		return right(undefined);
	}
}
