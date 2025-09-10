import { Module } from "@nestjs/common";
import { DeleteAssetByIdUseCase } from "./application/use-cases/delete-asset-by-id.use-case";
import { UploadAndCreateAssetUseCase } from "./application/use-cases/upload-and-create-asset.use-case";
import { AssetRepository } from "./domain/repositories/asset.repository";
import { Uploader } from "./domain/storage/uploader";
import { PrismaAssetRepository } from "./infra/database/repositories/prisma-asset.repository";
import { ImageKitStorageProvider } from "./infra/storage/image-kit.storage";

@Module({
	providers: [
		UploadAndCreateAssetUseCase,
		DeleteAssetByIdUseCase,
		{ provide: Uploader, useClass: ImageKitStorageProvider },
		{ provide: AssetRepository, useClass: PrismaAssetRepository },
	],
	exports: [
		{ provide: AssetRepository, useClass: PrismaAssetRepository },
		UploadAndCreateAssetUseCase,
	],
})
export class AssetModule {}
