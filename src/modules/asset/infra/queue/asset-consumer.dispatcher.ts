import { DomainEvent } from "@/core/domain/interfaces/event-dispatcher.interface";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";
import { AssetEventDispatcher } from "../../domain/interfaces/asset-event-dispatch.interface";

@Injectable()
export class BullAssetEventDispatcher implements AssetEventDispatcher {
	constructor(@InjectQueue("assets") private readonly queue: Queue) {}

	async dispatch(event: DomainEvent): Promise<void> {
		await this.queue.add(event.type, event);
	}
}
