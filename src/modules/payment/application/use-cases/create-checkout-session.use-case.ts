import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { CheckoutSessionCreationError } from "../../domain/errors/checkout-session-creation-error";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";

interface CreateCheckoutSessionUseCaseRequest {
	successUrl: string;
	cancelUrl: string;
	item: {
		name: string;
		amount: number;
	};
	metadata?: Record<string, string>;
}

type CreateCheckoutSessionUseCaseResponse = Either<
	CheckoutSessionCreationError,
	{
		url: string;
	}
>;

@Injectable()
export class CreateCheckoutSessionUseCase {
	constructor(
		private readonly paymentGatewayRepository: PaymentGatewayRepository,
	) {}

	async execute(
		param: CreateCheckoutSessionUseCaseRequest,
	): Promise<CreateCheckoutSessionUseCaseResponse> {
		const checkoutSession =
			await this.paymentGatewayRepository.createIntent({
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

		return right({
			url: checkoutSession.value.url,
		});
	}
}
