import { DeleteAssetByIdUseCase } from "@/modules/asset/application/use-cases/delete-asset-by-id.use-case";
import { AssetUnlinkedEvent } from "@/modules/asset/domain/events/asset-unlinked.event";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor("domain-events")
export class AssetProcessor {
	constructor(private readonly deleteAssetById: DeleteAssetByIdUseCase) {}

	@Process("asset.unlinked")
	async handleDeleteAsset(job: Job<AssetUnlinkedEvent>) {
		const { assetId, userId } = job.data;
		await this.deleteAssetById.execute({ assetId, userId });
	}
}
