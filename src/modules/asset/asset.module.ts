import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { DeleteAssetByIdUseCase } from "./application/use-cases/delete-asset-by-id.use-case";
import { UploadAndCreateAssetUseCase } from "./application/use-cases/upload-and-create-asset.use-case";
import { AssetEventDispatcher } from "./domain/interfaces/asset-event-dispatch.interface";
import { AssetRepository } from "./domain/repositories/asset.repository";
import { Uploader } from "./domain/storage/uploader";
import { PrismaAssetRepository } from "./infra/database/repositories/prisma-asset.repository";
import { AssetController } from "./infra/http/controllers/asset.controller";
import { BullAssetEventDispatcher } from "./infra/queue/asset-consumer.dispatcher";
import { AssetConsumerProcessor } from "./infra/queue/asset-consumer.processor";
import { ImageKitStorageProvider } from "./infra/storage/image-kit.storage";

@Module({
	imports: [BullModule.registerQueue({ name: "assets" })],
	controllers: [AssetController],
	providers: [
		UploadAndCreateAssetUseCase,
		DeleteAssetByIdUseCase,
		AssetConsumerProcessor,
		{
			provide: AssetEventDispatcher,
			useClass: BullAssetEventDispatcher,
		},
		{
			provide: Uploader,
			useClass: ImageKitStorageProvider,
		},
		{
			provide: AssetRepository,
			useClass: PrismaAssetRepository,
		},
	],
	exports: [
		{
			provide: AssetRepository,
			useClass: PrismaAssetRepository,
		},
	],
})
export class AssetModule {}
