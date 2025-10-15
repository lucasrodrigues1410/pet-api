import { Injectable, Logger } from "@nestjs/common";
import { addMinutes } from "date-fns";
import Stripe from "stripe";
import { EnvService } from "@/core/infra/env/env.service";
import { Either, left, right } from "@/shared/either";
import {
	CreatePaymentIntentParams,
	PaymentGateway,
} from "../../domain/gateways/payment-gateway";

@Injectable()
export class StripeAdapter implements PaymentGateway {
	private readonly logger = new Logger(StripeAdapter.name);
	private readonly stripe: Stripe;
	private readonly config: EnvService;

	constructor(config: EnvService) {
		this.config = config;
		const apiKey = config.get("STRIPE_API_KEY")!;
		this.stripe = new Stripe(apiKey, { typescript: true });
		this.logger.log("Stripe adapter initialized");
	}

	constructEvent<T = Stripe.Event>(payload: unknown, signature: string) {
		try {
			const stripeEvent = this.stripe.webhooks.constructEvent(
				payload as string | Buffer,
				signature,
				this.config.get("STRIPE_WEBHOOK_SECRET")!,
			);

			if (stripeEvent.type === "payment_intent.succeeded") {
				stripeEvent.data.object;
			}

			return {
				id: stripeEvent.id,
				data: stripeEvent as T,
				createdAt: new Date(stripeEvent.created * 1000),
			};
		} catch (error) {
			this.logger.error("Failed to construct webhook event", error);
			throw new Error(
				`Webhook signature verification failed: ${(error as Error).message}`,
			);
		}
	}

	async createPaymentIntent(
		params: CreatePaymentIntentParams,
	): Promise<Either<Error, { id: string; clientSecret?: string | null }>> {
		try {
			const paymentIntent = await this.stripe.paymentIntents.create(
				{ amount: params.amount, currency: "brl", metadata: params.metadata },
				{ idempotencyKey: params.idempotencyKey },
			);
			return right({
				id: paymentIntent.id,
				clientSecret: paymentIntent.client_secret,
			});
		} catch (error) {
			this.logger.error("Failed to create payment intent", error);
			return left(new Error("Failed to create payment intent"));
		}
	}

	async createCheckoutSession(
		params: Parameters<PaymentGateway["createCheckoutSession"]>[number],
	): Promise<Either<Error, { url: string; id: string }>> {
		try {
			const paymentIntent = await this.stripe.checkout.sessions.create(
				{
					mode: "payment",
					payment_method_types: ["card"],
					line_items: params.lineItems.map(
						(item) =>
							({
								price_data: {
									currency: "brl",
									product_data: {
										name: item.name,
										description: item.description,
										images: item.images,
									},
									unit_amount: item.price,
								},
								quantity: item.quantity,
							}) as Stripe.Checkout.SessionCreateParams.LineItem,
					),
					expires_at: Math.floor(addMinutes(new Date(), 30).getTime() / 1000),
					success_url: params.successUrl,
					cancel_url: params.cancelUrl,
					metadata: params.metadata,
				},
				{ idempotencyKey: params.idempotencyKey },
			);

			if (!paymentIntent.url) {
				this.logger.error("Failed to create checkout session: No URL returned");
				return left(new Error("Failed to create checkout session"));
			}

			return right({ url: paymentIntent.url, id: paymentIntent.id });
		} catch (error) {
			this.logger.error("Failed to create payment intent", error);
			return left(new Error("Failed to create payment intent"));
		}
	}
}
