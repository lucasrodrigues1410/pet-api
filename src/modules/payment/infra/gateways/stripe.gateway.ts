import { left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation-error";
import { PaymentGateway, ValidatedWebhookPayload, VerifyWebhookResult } from "../../domain/repositories/payment-gateway.repository";
import { InvalidWebhookSignatureError } from "../../domain/errors/invalid-webhook-signature.error";
import { addMinutes } from "date-fns";

type CreateSessionParams = Parameters<PaymentGateway["createCheckoutUrl"]>[0];
type CreateSessionResponse = ReturnType<PaymentGateway["createCheckoutUrl"]>;

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
	private stripe: Stripe;
	private readonly webhookSecret: string;

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get("STRIPE_API_KEY");
		this.stripe = new Stripe(apiKey);
		this.webhookSecret = this.configService.get(
			"STRIPE_WEBHOOK_SECRET",
		) as string;
	}

	verifyAndParseWebhook(
		params: Parameters<PaymentGateway["verifyAndParseWebhook"]>[0],
	): VerifyWebhookResult {
		try {
			const event = this.stripe.webhooks.constructEvent(
			  params.payload as Buffer,
			  params.signature,
			  this.webhookSecret,
			);
	  
			if (event.type.startsWith('payment_intent.')) {
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
			}
	  
			return right({ type: event.type, payload: null });
	  
		  } catch (err) {
			if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
			  console.error('Webhook signature verification failed:', err.message);
			  return left(new InvalidWebhookSignatureError());
			}
			console.error('Webhook processing error:', err);
			return left(new Error(`Webhook Error: ${err.message}`));
		  }
	}

	async createCheckoutUrl(params: CreateSessionParams): CreateSessionResponse {
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
			params.items.map((item) => ({
				price_data: {
					currency: "brl",
					product_data: {
						name: item.name,
						images: item.images,
						description: item.description,
					},
					unit_amount: item.amount * 100,
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
