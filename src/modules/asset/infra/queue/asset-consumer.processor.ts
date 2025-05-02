import { DeleteAssetByIdUseCase } from "@/modules/asset/application/use-cases/delete-asset-by-id.use-case";
import { AssetUnlinkedEvent } from "@/modules/asset/domain/events/asset-unlinked.event";
import { Process, Processor } from "@nestjs/bull";

@Processor("assets")
export class AssetConsumerProcessor {
	constructor(private readonly deleteAssetById: DeleteAssetByIdUseCase) {}

	@Process(AssetUnlinkedEvent.type)
	async handleDeleteAssetEvent(job: AssetUnlinkedEvent) {
		await this.deleteAssetById.execute({
			assetId: job.assetId,
			userId: job.userId,
		});
	}
}
