import { Either } from "@/core/either";
import { CheckoutSessionCreationError } from "../errors/checkout-session-creation-error";

export abstract class PaymentGatewayRepository {
	abstract createCheckoutSession(param: {
		successUrl: string;
		cancelUrl: string;
		items: Array<{
			name: string;
			amount: number;
			quantity: number;
		}>;
		metadata?: Record<string, string>;
	}): Promise<
		Either<
			CheckoutSessionCreationError,
			{
				intentId: string;
				url: string;
			}
		>
	>;
}
