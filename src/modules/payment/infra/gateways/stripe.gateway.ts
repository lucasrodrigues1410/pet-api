import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation-error";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";

@Injectable()
export class StripePaymentGateway implements PaymentGatewayRepository {
	private stripe: Stripe;

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get("STRIPE_API_KEY");
		this.stripe = new Stripe(apiKey);
	}

	async createCheckoutSession(params: {
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
	> {
		const lineItems = params.items.map((item) => ({
			price_data: {
				currency: "brl",
				product_data: {
					name: item.name,
				},
				unit_amount: item.amount,
			},
			quantity: item.quantity,
		}));

		try {
			const session = await this.stripe.checkout.sessions.create({
				success_url: params.successUrl,
				cancel_url: params.cancelUrl,
				line_items: lineItems,
				mode: "payment",
				metadata: params.metadata,
			});

			if (!session.url || !session.payment_intent) {
				return left(new CheckoutSessionCreationError());
			}

			return right({
				intentId: session.payment_intent.toString(),
				url: session.url || "",
			});
		} catch (error) {
			return left(new CheckoutSessionCreationError());
		}
	}
}
