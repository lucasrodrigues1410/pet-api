import { DomainEvent } from "@/core/domain/interfaces/event-dispatcher.interface";

export abstract class AssetEventDispatcher {
	abstract dispatch(event: DomainEvent): Promise<void>;
}
