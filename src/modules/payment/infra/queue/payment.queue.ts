import { PaymentWebhookReceivedEvent } from "@/modules/payment/domain/events/payment-webhook-received.event";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";

@Injectable()
export class PaymentQueue {
	constructor(@InjectQueue("payment") private readonly paymentQueue: Queue) {}

	async addPaymentWebhookJob(eventPayload: PaymentWebhookReceivedEvent) {
		await this.paymentQueue.add(
			PaymentWebhookReceivedEvent.EVENT_NAME,
			eventPayload,
		);
	}
}
