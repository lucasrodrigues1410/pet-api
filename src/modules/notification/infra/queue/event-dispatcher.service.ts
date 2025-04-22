import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";
import { NotificationPublisher } from "../../domain/interfaces/notification-publisher.interface";
import { NotificationEvent } from "../../domain/events/notification.event";

@Injectable()
export class BullNotificationDispatcher implements NotificationPublisher {
	constructor(@InjectQueue("notifications") private readonly queue: Queue) {}

	async dispatch(event: NotificationEvent): Promise<void> {
		this.queue.add(event);
	}
}
