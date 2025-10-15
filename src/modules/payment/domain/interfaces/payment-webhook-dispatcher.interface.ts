import { PaymentWebhookEvent } from "../events/payment-webhook.event";

export abstract class PaymentWebhookDispatcher {
	abstract dispatch(event: PaymentWebhookEvent): Promise<void>;
}
