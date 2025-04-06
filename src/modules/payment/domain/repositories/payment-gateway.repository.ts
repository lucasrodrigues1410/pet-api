import { Either } from "@/core/either";
import { CheckoutSessionCreationError } from "../errors/checkout-session-creation.error";
import { InvalidWebhookSignatureError } from "../errors/invalid-webhook-signature.error";

export interface ValidatedWebhookPayload {
	gatewayPaymentId: string;
	amount: number;
	currency: string;
	status: string;
	metadata: Record<string, any>;
	paidAt: Date;
}

export type VerifyWebhookResult = Either<
	InvalidWebhookSignatureError,
	{ type: string; payload: ValidatedWebhookPayload | null }
>;

export abstract class PaymentGateway {
	abstract verifyAndParseWebhook(params: {
		signature: string;
		payload: Buffer;
	}): Promise<VerifyWebhookResult>;
	abstract createCheckoutUrl(param: {
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
