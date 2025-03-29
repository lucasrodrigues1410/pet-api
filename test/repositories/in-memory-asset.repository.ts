import { Asset } from "@/modules/asset/domain/entities/asset";
import { AssetRepository } from "@/modules/asset/domain/repositories/asset.repository";

export class InMemoryAssetRepository implements AssetRepository {
	public items: Asset[] = [];

	async create(asset: Asset) {
		this.items.push(asset);
		await new Promise((resolve) => {
			resolve(asset);
		});
	}

	async existsByIds(ids: string[]): Promise<boolean> {
		return this.items.some((item) => ids.includes(item.id.toString()));
	}
}
