import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bullmq";
import { PaymentWebhookEvent } from "../../domain/events/payment-webhook.event";
import { PaymentWebhookDispatcher } from "../../domain/interfaces/payment-webhook-dispatcher.interface";

@Injectable()
export class BullPaymentWebhookDispatcher  implements PaymentWebhookDispatcher {
	constructor(@InjectQueue("payments") private readonly queue: Queue) {}

	async dispatch(event: PaymentWebhookEvent): Promise<void> {
		await this.queue.add(event.id, event);
	}
}
