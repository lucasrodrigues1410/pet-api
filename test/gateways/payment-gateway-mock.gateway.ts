import { Either, right } from "@/core/either";
import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation-error";
import { PaymentGatewayRepository } from "@/modules/payment/domain/repositories/payment-gateway.repository";

type CreateCheckoutSessionParams = Parameters<
	PaymentGatewayRepository["createCheckoutSession"]
>[0];
type CreateCheckoutSessionSuccess = { intentId: string; url: string };
type CreateCheckoutSessionResult = Either<
	CheckoutSessionCreationError,
	CreateCheckoutSessionSuccess
>;

export class PaymentGatewayMock implements PaymentGatewayRepository {
	public lastCallParams?: CreateCheckoutSessionParams;

	async createCheckoutSession(
		params: CreateCheckoutSessionParams,
	): Promise<CreateCheckoutSessionResult> {
		this.lastCallParams = params;
		await new Promise((resolve) => setTimeout(resolve, 10));
		return right({
			intentId: "mock_pi_12345",
			url: "https://mock.stripe.checkout/session_mock123",
		});
	}
}
