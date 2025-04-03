import { beforeEach, describe, expect, it } from "bun:test";
import { PaymentGatewayMock } from "test/gateways/payment-gateway-mock.gateway";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";
import { CreateCheckoutSessionUseCase } from "./create-checkout-session.use-case";

let mockPaymentGateway: PaymentGatewayRepository;

let sut: CreateCheckoutSessionUseCase;

describe("CreateCheckoutSessionUseCase", () => {
	beforeEach(() => {
		mockPaymentGateway = new PaymentGatewayMock();
		sut = new CreateCheckoutSessionUseCase(mockPaymentGateway);
	});

	it("should create a checkout session", async () => {
		const result = await sut.execute({
			item: {
				name: "Test Item",
				amount: 1000,
			},
			metadata: {
				test: "test",
			},
			successUrl: "https://example.com/success",
			cancelUrl: "https://example.com/cancel",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value).toEqual({
				url: "https://mock.stripe.checkout/session_mock123",
			});
		}
	});
});
