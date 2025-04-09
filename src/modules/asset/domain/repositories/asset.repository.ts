import { Asset } from "../entities/asset";

export abstract class AssetRepository {
	abstract create(asset: Asset): Promise<void>;
	abstract delete(id: string): Promise<void>;
	abstract existsByIds(ids: string[]): Promise<boolean>;
	abstract findById(id: string): Promise<Asset | null>;
}
