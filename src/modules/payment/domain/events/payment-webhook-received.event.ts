export class PaymentWebhookReceivedEvent {
	public static readonly EVENT_NAME = "payment.webhook.received";

	constructor(
		public readonly amount: number,
		public readonly metadata: Record<string, any>,
		public readonly webhookEventType: string,
	) {}
}
