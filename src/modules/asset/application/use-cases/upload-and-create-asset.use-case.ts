import { Injectable } from "@nestjs/common";
import { Either, right } from "src/core/either";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Asset } from "../../domain/entities/asset";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { UploaderProvider } from "../../domain/storage/uploader-provider";
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
		private uploadProvider: UploaderProvider,
	) {}

	async execute(
		data: UploadAndCreateAssetRequest,
	): Promise<UploadAndCreateAssetResponse> {
		const uploadResponse = await this.uploadProvider.upload(data);
		const asset = Asset.create(
			{
				name: uploadResponse.name,
				format: data.fileType,
				url: uploadResponse.url,
				formats: uploadResponse.formats,
				height: uploadResponse.height,
				width: uploadResponse.width,
				metadata: uploadResponse.metadata,
				thumbnailUrl: uploadResponse.thumbnailUrl,
			},
			new UniqueEntityID(uploadResponse.id),
		);

		await this.assetRepository.create(asset);
		return right({ asset });
	}
}
