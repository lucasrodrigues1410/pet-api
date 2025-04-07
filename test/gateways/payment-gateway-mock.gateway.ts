import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation.error";
import { PaymentGateway } from "@/modules/payment/domain/repositories/payment-gateway.repository";
import { Either, right } from "@/shared/either";

type CreateCheckoutSessionParams = Parameters<
	PaymentGateway["createCheckoutUrl"]
>[0];
type CreateCheckoutSessionSuccess = { intentId: string; url: string };
type CreateCheckoutSessionResult = Either<
	CheckoutSessionCreationError,
	CreateCheckoutSessionSuccess
>;

export class PaymentGatewayMock implements PaymentGateway {
	public lastCallParams?: CreateCheckoutSessionParams;

	async createCheckoutUrl(
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
