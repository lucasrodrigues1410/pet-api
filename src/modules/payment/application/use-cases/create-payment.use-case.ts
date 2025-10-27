import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Either, left, right } from "@/shared/either";
import { Payment } from "../../domain/entities/payment.entity";
import { PaymentAlreadyExistsError } from "../../domain/errors/payment-already-exists.error";
import { PaymentGatewayError } from "../../domain/errors/payment-gateway-error";
import { PaymentGateway } from "../../domain/gateways/payment-gateway";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

type CreatePaymentUseCaseRequest = {
	appointmentId: string;
	amountCents: number;
	serviceName: string;
	serviceDescription?: string;
	companyImage?: string;
};

type CreatePaymentUseCaseResponse = Either<
	PaymentAlreadyExistsError | PaymentGatewayError,
	{ url: string }
>;

@Injectable()
export class CreatePaymentUseCase {
	constructor(
		private readonly paymentRepository: PaymentRepository,
		private readonly paymentGateway: PaymentGateway,
	) {}

	async execute(
		request: CreatePaymentUseCaseRequest,
	): Promise<CreatePaymentUseCaseResponse> {
		const existingPayment = await this.paymentRepository.findByAppointmentId(
			request.appointmentId,
		);
		if (existingPayment) {
			return left(new PaymentAlreadyExistsError());
		}

		const appointmentId = new UniqueEntityID(request.appointmentId);
		const paymentIntent = await this.paymentGateway.createCheckoutSession({
			successUrl: `${process.env.APP_URL}/appointments?id=${request.appointmentId}`,
			cancelUrl: `${process.env.APP_URL}/`,
			lineItems: [
				{
					price: request.amountCents,
					quantity: 1,
					name: request.serviceName,
					description: request.serviceDescription,
					images: request.companyImage ? [request.companyImage] : [],
				},
			],
			metadata: { appointmentId: request.appointmentId },
			idempotencyKey: request.appointmentId,
		});

		if (paymentIntent.isLeft() || !paymentIntent?.value.url) {
			return left(new PaymentGatewayError("Failed to create checkout session"));
		}

		const payment = Payment.create({
			appointmentId,
			amount: request.amountCents,
			externalId: paymentIntent.value.id,
			checkoutUrl: paymentIntent.value.url,
		});

		await this.paymentRepository.save(payment);
		return right({ url: paymentIntent.value.url });
	}
}
