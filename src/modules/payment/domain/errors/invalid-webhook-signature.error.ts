export class InvalidWebhookSignatureError extends Error {
	constructor() {
		super("Invalid webhook signature");
		this.name = "InvalidWebhookSignatureError";
	}
}
