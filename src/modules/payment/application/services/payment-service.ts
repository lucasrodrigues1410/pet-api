import { Injectable } from "@nestjs/common";
import { PaymentGateway } from "../../domain/repositories/payment-gateway.repository";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { Payment } from "../../domain/entities/payment.entity";
import { Either, left, right } from "@/core/either";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation-error";

type CreateCheckoutSessionResponse = Either<
	CheckoutSessionCreationError,
	{
		url: string;
	}
>;

@Injectable()
export class PaymentService {
	constructor(
		private readonly paymentGateway: PaymentGateway,
		private readonly paymentRepository: PaymentRepository,
	) {}

	async createPaymentRecord(input: {
		amount: number;
	}) {
		const payment = Payment.create({
			amount: input.amount,
		});

		await this.paymentRepository.create(
			Payment.create({
				amount: input.amount,
			}),
		);

		return payment;
	}

	async createCheckoutSession(
		params: Parameters<PaymentGateway["createCheckoutUrl"]>[0],
	): Promise<CreateCheckoutSessionResponse> {
		const checkout = await this.paymentGateway.createCheckoutUrl(params);
		if (checkout.isLeft()) {
			return left(checkout.value);
		}
		return right({
			url: checkout.value.url,
		});
	}
}
