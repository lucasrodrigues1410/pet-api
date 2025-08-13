import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bullmq";
import {
	DomainEvent,
	EventDispatcher,
} from "@/core/domain/interfaces/event-dispatcher.interface";

@Injectable()
export class BullEventDispatcherService implements EventDispatcher {
	constructor(@InjectQueue("domain-events") private readonly queue: Queue) {}

	async dispatch(event: DomainEvent): Promise<void> {
		await this.queue.add(event.type, event);
	}
}
