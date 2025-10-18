import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { CreatePaymentUseCase } from "./application/use-cases/create-payment.use-case";
import { HandlePaymentChangeStatusUseCase } from "./application/use-cases/handle-payment-change-status.use-case";
import { ProcessWebhookUseCase } from "./application/use-cases/process-webhook.use-case";
import { PaymentGateway } from "./domain/gateways/payment-gateway";
import { PaymentWebhookDispatcher } from "./domain/interfaces/payment-webhook-dispatcher.interface";
import { PaymentRepository } from "./domain/repositories/payment.repository";
import { StripeAdapter } from "./infra/adapters/stripe.adapter";
import { PrismaPaymentRepository } from "./infra/database/prisma-payment.repository";
import { PaymentWebhookController } from "./infra/http/payment.webhook.controller";
import { BullPaymentWebhookDispatcher } from "./infra/queue/payment-dispatcher.service";
import { BullPaymentWebhookProcessor } from "./infra/queue/payment-processor.service";

@Module({
	imports: [BullModule.registerQueue({ name: "payments" })],
	providers: [
		CreatePaymentUseCase,
		HandlePaymentChangeStatusUseCase,
		ProcessWebhookUseCase,
		{ provide: PaymentGateway, useClass: StripeAdapter },
		{ provide: PaymentRepository, useClass: PrismaPaymentRepository },
		{
			provide: PaymentWebhookDispatcher,
			useClass: BullPaymentWebhookDispatcher,
		},
		BullPaymentWebhookProcessor,
	],
	controllers: [PaymentWebhookController],
	exports: [CreatePaymentUseCase],
})
export class PaymentModule {}
