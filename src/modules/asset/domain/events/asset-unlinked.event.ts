import { DomainEvent } from "@/core/domain/interfaces/event-dispatcher.interface";

export class AssetUnlinkedEvent implements DomainEvent {
	readonly eventType = "asset.unlinked";

	constructor(
		public readonly assetId: string,
		public readonly userId: string,
	) {}
}
