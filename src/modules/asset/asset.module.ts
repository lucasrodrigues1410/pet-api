import { Module } from "@nestjs/common";
import { UploadAndCreateAssetUseCase } from "./application/use-cases/upload-and-create-asset.use-case";
import { AssetRepository } from "./domain/repositories/asset.repository";
import { UploaderProvider } from "./domain/storage/uploader-provider";
import { PrismaAssetRepository } from "./infra/database/repositories/prisma-asset.repository";
import { AssetController } from "./infra/http/controllers/asset.controller";
import { ImageKitStorageProvider } from "./infra/storage/image-kit.storage";

@Module({
	controllers: [AssetController],
	providers: [
		UploadAndCreateAssetUseCase,
		{
			provide: UploaderProvider,
			useClass: ImageKitStorageProvider,
		},
		{
			provide: AssetRepository,
			useClass: PrismaAssetRepository,
		},
	],
})
export class AssetModule {}
