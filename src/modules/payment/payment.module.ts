import { Module } from "@nestjs/common";
import { PaymentGateway } from "./domain/repositories/payment-gateway.repository";
import { PaymentRepository } from "./domain/repositories/payment.repository";
import { PrismaPaymentRepository } from "./infra/database/repositories/prisma-payment.repository";
import { StripePaymentGateway } from "./infra/gateways/stripe.gateway";
import { PaymentService } from "./application/services/payment-service";
import { StripeWebhookController } from "./infra/http/controllers/stripe.webhook.controller";

@Module({
	providers: [
		PaymentService,
		{
			provide: PaymentRepository,
			useClass: PrismaPaymentRepository,
		},
		{
			provide: PaymentGateway,
			useClass: StripePaymentGateway,
		},
	],
	controllers: [StripeWebhookController],
	exports: [
		PaymentService,
		{
			provide: PaymentRepository,
			useClass: PrismaPaymentRepository,
		},
	],
})
export class PaymentModule {}
