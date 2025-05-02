import { AssetEvent } from "../events/asset.event";

export abstract class AssetEventDispatcher {
	abstract dispatch(event: AssetEvent): Promise<void>;
}
