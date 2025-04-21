import { EnvService } from "@/core/infra/env/env.service";
import { Either, left, right } from "@/shared/either";
import { Injectable, Logger } from "@nestjs/common";
import { getUnixTime } from "date-fns";
import Stripe from "stripe";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation.error";
import { InvalidWebhookSignatureError } from "../../domain/errors/invalid-webhook-signature.error";
import {
	PaymentGateway,
	ValidatedWebhookPayload,
	VerifyWebhookResult,
} from "../../domain/repositories/payment-gateway.repository";

type CreateSessionParams = Parameters<PaymentGateway["createCheckoutUrl"]>[0];
type CreateSessionResponse = ReturnType<PaymentGateway["createCheckoutUrl"]>;

type Item = {
	name: string;
	amount: number;
	quantity: number;
	images?: string[];
	description?: string;
};

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
	private stripe: Stripe;
	private readonly webhookSecret: string;
	private readonly logger = new Logger(StripePaymentGateway.name);

	constructor(private envService: EnvService) {
		const apiKey = envService.get("STRIPE_API_KEY");
		this.stripe = new Stripe(apiKey);
		this.webhookSecret = envService.get("STRIPE_WEBHOOK_SECRET");
	}

	async verifyAndParseWebhook(
		params: Parameters<PaymentGateway["verifyAndParseWebhook"]>[0],
	): Promise<VerifyWebhookResult> {
		try {
			const event = await this.stripe.webhooks.constructEventAsync(
				params.payload,
				params.signature,
				this.webhookSecret,
			);

			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			const genericPayload: ValidatedWebhookPayload = {
				gatewayPaymentId: paymentIntent.id,
				amount: paymentIntent.amount_received,
				currency: paymentIntent.currency,
				status: paymentIntent.status,
				metadata: paymentIntent.metadata,
				paidAt: new Date(paymentIntent.created * 1000),
			};
			return right({ type: event.type, payload: genericPayload });
		} catch (err) {
			if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
				this.logger.error("Invalid webhook signature", err);
				return left(new InvalidWebhookSignatureError());
			}

			return left(new Error(`Webhook Error: ${(err as Error).message}`));
		}
	}

	async createCheckoutUrl(params: CreateSessionParams): CreateSessionResponse {
		const lineItems = this.createLineItems(params.items);

		try {
			const session = await this.stripe.checkout.sessions.create({
				success_url: params.successUrl,
				line_items: lineItems,
				mode: "payment",
				metadata: params.metadata || {},
				payment_method_types: ["card"],
				payment_intent_data: {
					capture_method: "manual",
				},
				expires_at: params.expirationDate
					? getUnixTime(params.expirationDate)
					: undefined,
			});

			if (!session.url) {
				return left(new CheckoutSessionCreationError());
			}

			return right({
				url: session.url,
				sessionId: session.id,
			});
		} catch (error) {
			return left(
				error instanceof Stripe.errors.StripeError
					? new CheckoutSessionCreationError(error.message)
					: new CheckoutSessionCreationError(),
			);
		}
	}

	private createLineItems(
		items: Item[],
	): Stripe.Checkout.SessionCreateParams.LineItem[] {
		return items.map((item) => {
			return {
				price_data: {
					currency: "brl",
					product_data: {
						name: item.name,
						images: item.images,
						description: item.description?.substring(0, 500),
					},
					unit_amount: Math.round(item.amount * 100),
				},
				quantity: item.quantity,
			};
		});
	}

	async cancelPayment(params: {
		gatewayPaymentId: string;
	}): Promise<Either<Error, void>> {
		try {
			await this.stripe.paymentIntents.cancel(params.gatewayPaymentId);
			return right(undefined);
		} catch (error) {
			return left(
				new Error(`Failed to cancel payment: ${(error as Error).message}`),
			);
		}
	}
}
