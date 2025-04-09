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

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((item) => item.id.toString() !== id);
	}

	async findById(id: string): Promise<Asset | null> {
		const asset = this.items.find((item) => item.id.toString() === id);

		if (!asset) {
			return null;
		}

		return asset;
	}

	async existsByIds(ids: string[]): Promise<boolean> {
		return this.items.some((item) => ids.includes(item.id.toString()));
	}
}
