import { Injectable } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

type ProcessPaymentRequest = Parameters<
	PaymentGatewayRepository["createIntent"]
>[0] & {
	payerId: string;
};

@Injectable()
export class PaymentProcessorService {
	constructor(
		private readonly paymentGateway: PaymentGatewayRepository,
		private readonly paymentRepository: PaymentRepository,
	) {}

	async process(params: ProcessPaymentRequest) {
		const payment = Payment.create({
			payerId: params.payerId,
			amount: params.items.reduce(
				(acc, item) => acc + item.amount * item.quantity,
				0,
			),
		});

		await this.paymentRepository.create(payment);
		const intent = await this.paymentGateway.createIntent(params);

		return {
			paymentId: payment.id,
			intent,
		};
	}
}
