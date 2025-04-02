import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation-error";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

interface CreateCheckoutSessionUseCaseRequest {
	successUrl: string;
	cancelUrl: string;
	item: {
		name: string;
		amount: number;
	};
	metadata?: Record<string, string>;
	payerId: string;
}

type CreateCheckoutSessionUseCaseResponse = Either<
	CheckoutSessionCreationError,
	{
		url: string;
		paymentId: string;
	}
>;

@Injectable()
export class CreateCheckoutSessionUseCase {
	constructor(
		private readonly paymentRepository: PaymentRepository,
		private readonly paymentGatewayRepository: PaymentGatewayRepository,
	) {}

	async execute(
		param: CreateCheckoutSessionUseCaseRequest,
	): Promise<CreateCheckoutSessionUseCaseResponse> {
		const checkoutSession =
			await this.paymentGatewayRepository.createCheckoutSession({
				successUrl: param.successUrl,
				cancelUrl: param.cancelUrl,
				items: [
					{
						name: param.item.name,
						amount: param.item.amount,
						quantity: 1,
					},
				],
				metadata: param.metadata,
			});

		if (checkoutSession.isLeft()) {
			return left(checkoutSession.value);
		}

		const payment = Payment.create({
			amount: param.item.amount,
			payerId: param.payerId,
			gatewayPaymentIntentId: checkoutSession.value.intentId,
		});
		await this.paymentRepository.create(payment);

		return right({
			url: checkoutSession.value.url,
			paymentId: payment.id.toString(),
		});
	}
}
