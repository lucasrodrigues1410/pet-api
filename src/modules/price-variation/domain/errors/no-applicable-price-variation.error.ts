export class NoApplicablePriceVariationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NoApplicablePriceVariationError";
	}
}
