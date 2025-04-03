import { Either } from "@/core/either";
import { CheckoutSessionCreationError } from "../errors/checkout-session-creation-error";

export abstract class PaymentGatewayRepository {
	abstract createIntent(param: {
		successUrl: string;
		items: Array<{
			name: string;
			amount: number;
			quantity: number;
			description?: string;
			images?: string[];
		}>;
		metadata?: Record<string, string>;
	}): Promise<
		Either<
			CheckoutSessionCreationError,
			{
				url: string;
			}
		>
	>;
}
