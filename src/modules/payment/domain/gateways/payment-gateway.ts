import { Either } from "@/shared/either";

export type CreatePaymentIntentParams = {
	amount: number;
	metadata?: Record<string, string>;
	idempotencyKey?: string;
};

export abstract class PaymentGateway {
	abstract constructEvent<T = Record<string, any>>(
		payload: unknown,
		signature: string,
	): { id: string; data: T; createdAt: Date };
	abstract createPaymentIntent(
		params: CreatePaymentIntentParams,
	): Promise<Either<Error, { id: string; clientSecret?: string | null }>>;
	abstract createCheckoutSession(params: {
		successUrl: string;
		cancelUrl: string;
		lineItems: Array<{
			price: number;
			quantity: number;
			name: string;
			description?: string;
			images?: string[];
		}>;
		metadata?: Record<string, string>;
		idempotencyKey?: string;
	}): Promise<Either<Error, { url: string; id: string }>>;
}
