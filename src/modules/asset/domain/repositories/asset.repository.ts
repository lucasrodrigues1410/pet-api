import { Asset } from "../entities/asset";

export abstract class AssetRepository {
	abstract create(asset: Asset): Promise<void>;
	abstract existsByIds(ids: string[]): Promise<boolean>;
}
