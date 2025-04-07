import {
	DomainEvent,
	EventDispatcher,
} from "@/core/domain/interfaces/event-dispatcher.interface";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";

@Injectable()
export class BullEventDispatcherService implements EventDispatcher {
	constructor(@InjectQueue("domain-events") private readonly queue: Queue) {}

	async dispatch(event: DomainEvent): Promise<void> {
		await this.queue.add(event.name, event);
	}
}
