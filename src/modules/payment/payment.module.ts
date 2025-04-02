import { Module } from "@nestjs/common";
import { CreateCheckoutSessionUseCase } from "./application/use-cases/create-checkout-session.use-case";
import { PaymentGatewayRepository } from "./domain/repositories/payment-gateway.repository";
import { PaymentRepository } from "./domain/repositories/payment.repository";
import { PrismaPaymentRepository } from "./infra/database/repositories/prisma-payment.repository";
import { StripePaymentGateway } from "./infra/gateways/stripe.gateway";

@Module({
	providers: [
		CreateCheckoutSessionUseCase,
		{
			provide: PaymentRepository,
			useClass: PrismaPaymentRepository,
		},
		{
			provide: PaymentGatewayRepository,
			useClass: StripePaymentGateway,
		},
	],
})
export class PaymentModule {}
