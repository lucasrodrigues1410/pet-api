export class CheckoutSessionCreationError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "CheckoutSessionCreationError";
	}
}
