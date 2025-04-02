import { beforeEach, describe, expect, it } from "bun:test";
import { PaymentGatewayMock } from "test/gateways/payment-gateway-mock.gateway";
import { InMemoryPaymentRepository } from "test/repositories/in-memory-payment.repository";
import { PaymentGatewayRepository } from "../../domain/repositories/payment-gateway.repository";
import { CreateCheckoutSessionUseCase } from "./create-checkout-session.use-case";

let inMemoryPaymentRepository: InMemoryPaymentRepository;
let mockPaymentGateway: PaymentGatewayRepository;

let sut: CreateCheckoutSessionUseCase;

describe("CreateCheckoutSessionUseCase", () => {
	beforeEach(() => {
		inMemoryPaymentRepository = new InMemoryPaymentRepository();
		mockPaymentGateway = new PaymentGatewayMock();
		sut = new CreateCheckoutSessionUseCase(
			inMemoryPaymentRepository,
			mockPaymentGateway,
		);
	});

	it("should create a checkout session", async () => {
		const result = await sut.execute({
			item: {
				name: "Test Item",
				amount: 1000,
			},
			payerId: "payer_12345",
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
				paymentId: result.value.paymentId,
			});
		}
	});

	it("should save the payment in the repository", async () => {
		await sut.execute({
			item: {
				name: "Test Item",
				amount: 1000,
			},
			payerId: "payer_12345",
			metadata: {
				test: "test",
			},
			successUrl: "https://example.com/success",
			cancelUrl: "https://example.com/cancel",
		});

		expect(inMemoryPaymentRepository.items).toHaveLength(1);
		expect(inMemoryPaymentRepository.items[0]).toMatchObject(
			expect.objectContaining({
				amount: 1000,
				payerId: "payer_12345",
				gatewayPaymentIntentId: "mock_pi_12345",
			}),
		);
	});
});
