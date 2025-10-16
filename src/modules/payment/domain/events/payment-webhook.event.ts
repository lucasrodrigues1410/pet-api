export abstract class PaymentWebhookEvent<T = Record<string, unknown>> {
	abstract data: T;
	abstract id: string;
}
