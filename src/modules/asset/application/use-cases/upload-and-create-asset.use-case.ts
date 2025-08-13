import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, left, right } from "@/shared/either";
import { Asset } from "../../domain/entities/asset";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { Uploader } from "../../domain/storage/uploader";
import { InvalidAssetTypeError } from "../errors/invalid-asset-type.error";

interface UploadAndCreateAssetRequest {
	file: Express.Multer.File;
	userId: string;
	fileName?: string;
	folder?: string;
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
		file: data,
		userId,
		fileName,
		folder,
	}: UploadAndCreateAssetRequest): Promise<UploadAndCreateAssetResponse> {
		const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
		if (!allowedFileTypes.includes(data.mimetype)) {
			return left(new InvalidAssetTypeError(data.mimetype));
		}

		var fileNameParts = fileName?.split("/") || [];
		folder = fileNameParts.slice(0, -1).join("/") || "";
		fileName = fileNameParts[fileNameParts.length - 1] || data.originalname;

		const { url, name, id, height, width, thumbnailUrl } =
			await this.uploader.upload({
				fileName: fileName,
				fileType: data.mimetype,
				body: data.buffer,
				folder: folder,
			});

		const asset = Asset.create({
			name,
			fileType: data.mimetype,
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
