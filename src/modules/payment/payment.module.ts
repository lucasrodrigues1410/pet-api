import { EnvModule } from "@/core/infra/env/env.module";
import { Module } from "@nestjs/common";
import { PaymentService } from "./application/services/payment-service";
import { PaymentGateway } from "./domain/repositories/payment-gateway.repository";
import { PaymentRepository } from "./domain/repositories/payment.repository";
import { PrismaPaymentRepository } from "./infra/database/repositories/prisma-payment.repository";
import { StripePaymentGateway } from "./infra/gateways/stripe.gateway";
import { StripeWebhookController } from "./infra/http/controllers/stripe.webhook.controller";

@Module({
	imports: [EnvModule],
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
