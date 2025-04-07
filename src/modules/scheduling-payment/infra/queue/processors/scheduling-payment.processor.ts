import { PaymentWebhookReceivedEvent } from "@/modules/payment/domain/events/payment-webhook-received.event";
import { ConfirmPaymentAndSchedulingUseCase } from "@/modules/scheduling-payment/application/use-cases/confirm-payment-and-scheduling.use-case";
import { Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor("domain-events")
@Injectable()
export class SchedulingPaymentProcessor {
	private readonly logger = new Logger(SchedulingPaymentProcessor.name);

	constructor(
		private readonly confirmPaymentAndSchedulingUseCase: ConfirmPaymentAndSchedulingUseCase,
	) {}

	@Process("payment.webhook.received")
	async handleStripeWebhook(job: Job<PaymentWebhookReceivedEvent>) {
		try {
			const event = job.data;
			this.logger.log(
				`Processing job for payment with event type ${event.webhookEventType}`,
			);

			if (
				event.webhookEventType === "checkout.session.completed" &&
				event.metadata &&
				"appointmentIntentId" in event.metadata &&
				String(event.metadata.appointmentIntentId).length > 0
			) {
				await this.confirmPaymentAndSchedulingUseCase.execute({
					scheduleData: {
						appointmentIntentId: event.metadata.appointmentIntentId,
					},
				});
				this.logger.log(
					"Successfully processed scheduling confirmation for payment",
				);
			} else {
				this.logger.log(
					`Event ${event.webhookEventType} for payment does not meet processing criteria. Skipping.`,
				);
			}
		} catch (error) {
			this.logger.error(
				`Error processing job ${job.id}: ${(error as Error).message}`,
			);
			throw error;
		}
	}
}
