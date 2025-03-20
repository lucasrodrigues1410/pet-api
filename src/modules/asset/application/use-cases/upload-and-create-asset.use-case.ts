import { Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { Asset } from "../../domain/entities/asset";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { Uploader } from "../../domain/storage/uploader";
import { InvalidAssetTypeError } from "../errors/invalid-asset-type.error";

interface UploadAndCreateAssetRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
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
	}: UploadAndCreateAssetRequest): Promise<UploadAndCreateAssetResponse> {
		const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
		if (!allowedFileTypes.includes(fileType)) {
			return left(new InvalidAssetTypeError(fileType));
		}

		const { url, name, height, width, thumbnailUrl } =
			await this.uploader.upload({ fileName, fileType, body });

		const asset = Asset.create({
			name,
			fileType,
			url,
			height,
			width,
			thumbnailUrl,
		});

		await this.assetRepository.create(asset);

		return right({
			asset,
		});
	}
}
