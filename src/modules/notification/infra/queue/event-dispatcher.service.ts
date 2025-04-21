import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";
import { NotificationPublisher } from "../../domain/interfaces/notification-publisher.interface";
import { NotificationSenderParams } from "../../domain/interfaces/notification-sender.interface";

@Injectable()
export class BullNotificationDispatcher implements NotificationPublisher {
	constructor(@InjectQueue("notifications") private readonly queue: Queue) {}

	async dispatch(userId: string, payload: NotificationSenderParams) {
		this.queue.add({ userId, payload });
	}
}
