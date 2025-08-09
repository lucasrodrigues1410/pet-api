import { DomainEvent } from "@/core/domain/interfaces/event-dispatcher.interface";

export class AssetUnlinkedEvent extends DomainEvent {
	static readonly type = "unlinked";

	constructor(
		public readonly assetId: string,
		public readonly userId: string,
	) {
		super(AssetUnlinkedEvent.type);
	}
}
