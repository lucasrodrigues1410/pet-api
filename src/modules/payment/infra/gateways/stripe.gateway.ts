import { left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation-error";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";

type CreateSessionParams = Parameters<
	PaymentGatewayRepository["createIntent"]
>[0];
type CreateSessionResponse = ReturnType<
	PaymentGatewayRepository["createIntent"]
>;

@Injectable()
export class StripePaymentGateway implements PaymentGatewayRepository {
	private stripe: Stripe;

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get("STRIPE_API_KEY");
		this.stripe = new Stripe(apiKey);
	}

	async createIntent(params: CreateSessionParams): CreateSessionResponse {
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
			params.items.map((item) => ({
				price_data: {
					currency: "brl",
					product_data: {
						name: item.name,
						images: item.images,
						description: item.description,
					},
					unit_amount: item.amount,
				},
				quantity: item.quantity,
			}));

		try {
			const session = await this.stripe.checkout.sessions.create({
				success_url: params.successUrl,
				line_items: lineItems,
				mode: "payment",
				metadata: params.metadata,
			});

			if (!session.url) {
				return left(new CheckoutSessionCreationError());
			}

			return right({
				url: session.url,
			});
		} catch (error) {
			console.log(error);
			return left(new CheckoutSessionCreationError());
		}
	}
}
