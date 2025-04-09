import { DomainEvent } from "@/core/domain/interfaces/event-dispatcher.interface";

export class PaymentWebhookReceivedEvent implements DomainEvent {
	readonly name = "payment.webhook.received";

	constructor(
		public readonly amount: number,
		public readonly metadata: Record<string, any>,
		public readonly webhookEventType: string,
		public readonly intentId: string,
	) {}
}
