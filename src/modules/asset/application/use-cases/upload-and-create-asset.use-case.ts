import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, left, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Asset } from "../../domain/entities/asset";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { Uploader } from "../../domain/storage/uploader";
import { InvalidAssetTypeError } from "../errors/invalid-asset-type.error";

interface UploadAndCreateAssetRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
	userId: string;
}

type UploadAndCreateAssetResponse = Either<
	InvalidAssetTypeError,
	{
		asset: Asset;
	}
>;

@Injectable()
export class UploadAndCreateAssetUseCase {
	constructor(
		private assetRepository: AssetRepository,
		private uploader: Uploader,
	) {}

	async execute({
		fileName,
		fileType,
		body,
		userId,
	}: UploadAndCreateAssetRequest): Promise<UploadAndCreateAssetResponse> {
		const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
		if (!allowedFileTypes.includes(fileType)) {
			return left(new InvalidAssetTypeError(fileType));
		}

		const { url, name, id, height, width, thumbnailUrl } =
			await this.uploader.upload({ fileName, fileType, body });

		const asset = Asset.create({
			name,
			fileType,
			url,
			height,
			fileId: id,
			width,
			thumbnailUrl,
			userId: new UniqueEntityID(userId),
		});

		await this.assetRepository.create(asset);

		return right({
			asset,
		});
	}
}
